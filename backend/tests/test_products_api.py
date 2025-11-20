from fastapi import status

from app.infrastructure.database.sqlite.seed_data import PRODUCTS


def test_get_products_returns_seeded_items(client):
    response = client.get("/api/v1/products")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == len(PRODUCTS)
    assert {item["name"] for item in data[:3]} <= {p["name"] for p in PRODUCTS}


def test_get_product_returns_404_for_missing_item(client):
    response = client.get("/api/v1/products/9999")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "not found" in response.json()["detail"].lower()


def test_update_product_successfully_persists_changes(client):
    products = client.get("/api/v1/products").json()
    product_id = products[0]["id"]
    new_price = products[0]["price"] + 10
    new_stock = products[0]["stock"] + 5

    response = client.put(
        f"/api/v1/products/{product_id}",
        json={"price": new_price, "stock": new_stock},
    )

    assert response.status_code == status.HTTP_200_OK
    payload = response.json()
    assert payload["price"] == new_price
    assert payload["stock"] == new_stock


def test_update_product_without_payload_returns_400(client):
    products = client.get("/api/v1/products").json()
    product_id = products[0]["id"]

    response = client.put(f"/api/v1/products/{product_id}", json={})

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "no fields" in response.json()["detail"].lower()
