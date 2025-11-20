from fastapi import status


def _first_product(client):
    products = client.get("/api/v1/products").json()
    assert products, "Seed data should include products"
    return products[0]


def _create_delivered_order(client, auth_state, customer_user, product_manager_user):
    product = _first_product(client)
    create_response = client.post(
        "/api/v1/orders",
        json={
            "delivery_address": "789 Fashion Ave",
            "items": [{"product_id": product["id"], "quantity": 1}],
        },
    )
    assert create_response.status_code == status.HTTP_201_CREATED
    order = create_response.json()

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"
    update = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "delivered"},
    )
    assert update.status_code == status.HTTP_200_OK

    auth_state["user"] = customer_user
    auth_state["role"] = "customer"
    return product["id"], order["id"]


def test_customer_can_create_review_after_delivery(client, auth_state, customer_user, product_manager_user):
    product_id, _ = _create_delivered_order(client, auth_state, customer_user, product_manager_user)

    response = client.post(
        f"/api/v1/products/{product_id}/reviews",
        json={"rating": 5},
    )

    assert response.status_code == status.HTTP_201_CREATED
    payload = response.json()
    assert payload["product_id"] == product_id
    assert payload["is_approved"] is True


def test_review_requires_completed_purchase(client):
    product = _first_product(client)
    response = client.post(
        f"/api/v1/products/{product['id']}/reviews",
        json={"rating": 4},
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "cannot create review" in response.json()["detail"].lower()


def test_pending_reviews_visible_to_managers(client, auth_state, customer_user, product_manager_user):
    product_id, _ = _create_delivered_order(client, auth_state, customer_user, product_manager_user)

    review_response = client.post(
        f"/api/v1/products/{product_id}/reviews",
        json={"rating": 4, "comment": "Amazing craftsmanship!"},
    )
    assert review_response.status_code == status.HTTP_201_CREATED
    review = review_response.json()

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"

    pending = client.get("/api/v1/reviews/pending")
    assert pending.status_code == status.HTTP_200_OK
    pending_ids = [item["id"] for item in pending.json()]
    assert review["id"] in pending_ids


def test_manager_can_approve_review_and_it_becomes_public(
    client,
    auth_state,
    customer_user,
    product_manager_user,
):
    product_id, _ = _create_delivered_order(client, auth_state, customer_user, product_manager_user)
    review_response = client.post(
        f"/api/v1/products/{product_id}/reviews",
        json={"rating": 5, "comment": "Loved the fit and finish!"},
    )
    assert review_response.status_code == status.HTTP_201_CREATED
    review = review_response.json()

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"

    approve = client.patch(f"/api/v1/reviews/{review['id']}/approve")
    assert approve.status_code == status.HTTP_200_OK
    assert approve.json()["is_approved"] is True

    public = client.get(f"/api/v1/products/{product_id}/reviews")
    public_ids = [item["id"] for item in public.json()]
    assert review["id"] in public_ids


def test_manager_can_reject_review(client, auth_state, customer_user, product_manager_user):
    product_id, _ = _create_delivered_order(client, auth_state, customer_user, product_manager_user)
    review_response = client.post(
        f"/api/v1/products/{product_id}/reviews",
        json={"rating": 3, "comment": "Did not like the fabric."},
    )
    assert review_response.status_code == status.HTTP_201_CREATED
    review = review_response.json()

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"

    response = client.delete(f"/api/v1/reviews/{review['id']}/reject")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    pending = client.get("/api/v1/reviews/pending").json()
    assert review["id"] not in [item["id"] for item in pending]


def test_customer_cannot_approve_reviews(client, auth_state, customer_user, product_manager_user):
    product_id, _ = _create_delivered_order(client, auth_state, customer_user, product_manager_user)
    review_response = client.post(
        f"/api/v1/products/{product_id}/reviews",
        json={"rating": 5, "comment": "Needs approval"},
    )
    assert review_response.status_code == status.HTTP_201_CREATED
    review = review_response.json()

    response = client.patch(f"/api/v1/reviews/{review['id']}/approve")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"
    approved = client.patch(f"/api/v1/reviews/{review['id']}/approve")
    assert approved.status_code == status.HTTP_200_OK
