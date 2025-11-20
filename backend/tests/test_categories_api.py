from fastapi import status


def test_create_category_trims_and_capitalizes_name(client):
    response = client.post(
        "/api/v1/categories",
        json={"name": "  exclusive drops  "},
    )

    assert response.status_code == status.HTTP_201_CREATED
    payload = response.json()
    assert payload["name"] == "Exclusive Drops"


def test_create_category_rejects_duplicates(client):
    name = "Limited Edition"
    first = client.post("/api/v1/categories", json={"name": name})
    assert first.status_code == status.HTTP_201_CREATED

    duplicate = client.post("/api/v1/categories", json={"name": name})
    assert duplicate.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in duplicate.json()["detail"].lower()


def test_update_category_conflict_returns_400(client):
    alpha = client.post("/api/v1/categories", json={"name": "Alpha Line"}).json()
    beta = client.post("/api/v1/categories", json={"name": "Beta Line"}).json()

    response = client.put(
        f"/api/v1/categories/{beta['id']}",
        json={"name": alpha["name"]},
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"].lower()


def test_delete_category_removes_entity(client):
    created = client.post("/api/v1/categories", json={"name": "To Be Removed"}).json()

    delete_response = client.delete(f"/api/v1/categories/{created['id']}")
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT

    follow_up = client.get(f"/api/v1/categories/{created['id']}")
    assert follow_up.status_code == status.HTTP_404_NOT_FOUND


def test_get_category_returns_404_for_unknown_id(client):
    response = client.get("/api/v1/categories/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
