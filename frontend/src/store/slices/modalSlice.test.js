import reducer, { setModal, clearModal } from "./modalSlice";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("modalSlice reducer", () => {
  it("sets modal with name and data", () => {
    const state = reducer(
      initialState,
      setModal({ name: "TEST_MODAL", data: { foo: "bar" } }),
    );

    expect(state.modal).toEqual({ name: "TEST_MODAL", data: { foo: "bar" } });
  });

  it("clears modal", () => {
    const withModal = { modal: { name: "ANY", data: {} } };

    const state = reducer(withModal, clearModal());

    expect(state.modal).toBeNull();
  });
});
