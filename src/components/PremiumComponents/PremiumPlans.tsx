import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PremiumPlans = () => {
  const [plans, setPlans] = useState([
    { name: "Aylık", days: 30, price: 69 },
    { name: "3 Aylık", days: 90, price: 180 },
    { name: "Yıllık", days: 365, price: 499 },
  ]);

  const [editModal, setEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    days: number;
    price: number;
  } | null>(null);

  const handleEdit = (plan: { name: string; days: number; price: number }) => {
    setSelectedPlan(plan);
    setEditModal(true);
  };

  const saveChanges = (updatedPlan: {
    name: string;
    days: number;
    price: number;
  }) => {
    setPlans((prev) =>
      prev.map((p) => (p.name === updatedPlan.name ? updatedPlan : p))
    );

    setEditModal(false);
  };

  return (
    <div className="mt-5">
      <h5 className="fw-bold mb-3">Premium Plan Ayarları</h5>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Plan Adı</th>
              <th>Süre</th>
              <th>Fiyat</th>
              <th>İşlem</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.days} Gün</td>
                <td>{p.price}₺</td>
                <td>
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => handleEdit(p)}
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------- Düzenleme Modali ----------------- */}
      {editModal && selectedPlan && (
        <Modal show={editModal} onHide={() => setEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Plan Düzenle – {selectedPlan.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditPlanForm
              plan={selectedPlan}
              onSave={saveChanges}
              onClose={() => setEditModal(false)}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

/* ------------------------------------------------------------
   ✔ Form komponenti (modal içinde) – aynı dosyada!
------------------------------------------------------------- */

const EditPlanForm = ({
  plan,
  onSave,
  onClose,
}: {
  plan: { name: string; days: number; price: number };
  onSave: (p: { name: string; days: number; price: number }) => void;
  onClose: () => void;
}) => {
  const [days, setDays] = useState(plan.days);
  const [price, setPrice] = useState(plan.price);

  useEffect(() => {
    setDays(plan.days);
    setPrice(plan.price);
  }, [plan]);

  const handleSave = () => {
    onSave({
      name: plan.name,
      days,
      price,
    });
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Süre (Gün)</Form.Label>
        <Form.Control
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Fiyat (₺)</Form.Label>
        <Form.Control
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
        <Button variant="primary" className="btn-dark" onClick={handleSave}>
          Kaydet
        </Button>
      </div>
    </>
  );
};

export default PremiumPlans;
