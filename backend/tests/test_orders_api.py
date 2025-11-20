from fastapi import status


def _first_product(client):
    products = client.get("/api/v1/products").json()
    assert products, "Seed data should include products"
    return products[0]


def _create_order(client, product_id, quantity=1):
    payload = {
        "delivery_address": "500 Market Street",
        "items": [{"product_id": product_id, "quantity": quantity}],
    }
    return client.post("/api/v1/orders", json=payload)


def test_customer_can_create_and_list_orders(client):
    product = _first_product(client)
    create_response = _create_order(client, product["id"])

    assert create_response.status_code == status.HTTP_201_CREATED
    order_id = create_response.json()["id"]

    list_response = client.get("/api/v1/orders")
    assert list_response.status_code == status.HTTP_200_OK
    order_ids = {order["id"] for order in list_response.json()}
    assert order_id in order_ids


def test_only_customers_can_create_orders(client, auth_state, product_manager_user):
    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"
    product = _first_product(client)

    response = _create_order(client, product["id"])
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_manager_can_list_all_orders(client, auth_state, product_manager_user, another_customer_user):
    product = _first_product(client)
    first_create = _create_order(client, product["id"])
    assert first_create.status_code == status.HTTP_201_CREATED
    first_order = first_create.json()

    auth_state["user"] = another_customer_user
    auth_state["role"] = "customer"
    second_create = _create_order(client, product["id"])
    assert second_create.status_code == status.HTTP_201_CREATED
    second_order = second_create.json()

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"
    response = client.get("/api/v1/orders/all")

    assert response.status_code == status.HTTP_200_OK
    payload = response.json()
    assert {first_order["id"], second_order["id"]}.issubset({order["id"] for order in payload})
    assert {first_order["customer_id"], second_order["customer_id"]}.issubset(
        {order["customer_id"] for order in payload}
    )


def test_order_status_update_requires_manager_role(client, auth_state, product_manager_user):
    product = _first_product(client)
    create_resp = _create_order(client, product["id"])
    assert create_resp.status_code == status.HTTP_201_CREATED
    order = create_resp.json()

    unauthorized = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "delivered"},
    )
    assert unauthorized.status_code == status.HTTP_403_FORBIDDEN

    auth_state["user"] = product_manager_user
    auth_state["role"] = "product_manager"
    response = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "delivered"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "delivered"


def test_customer_cannot_access_another_order(client, auth_state, another_customer_user):
    product = _first_product(client)
    create_resp = _create_order(client, product["id"])
    assert create_resp.status_code == status.HTTP_201_CREATED
    order = create_resp.json()

    auth_state["user"] = another_customer_user
    auth_state["role"] = "customer"
    response = client.get(f"/api/v1/orders/{order['id']}")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_cancel_order_allows_owner_only(client, auth_state, another_customer_user):
    product = _first_product(client)
    create_resp = _create_order(client, product["id"])
    assert create_resp.status_code == status.HTTP_201_CREATED
    order = create_resp.json()
    original_user = auth_state["user"]

    auth_state["user"] = another_customer_user
    auth_state["role"] = "customer"
    forbidden = client.post(f"/api/v1/orders/{order['id']}/cancel")
    assert forbidden.status_code == status.HTTP_403_FORBIDDEN

    auth_state["user"] = original_user
    auth_state["role"] = "customer"
    response = client.post(f"/api/v1/orders/{order['id']}/cancel")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "cancelled"
