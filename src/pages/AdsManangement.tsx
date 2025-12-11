/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Title from "../components/Title";
import { getAds } from "../services/adsService";
import type { IAd } from "../types/ads";
import AdsEditModal from "../components/AdsComponents/AdsEditModal";
import AdsCreateModal from "../components/AdsComponents/AdsCreateModal";
import AdsList from "../components/AdsComponents/AdsList";

const AdsManagement = () => {
  const [ads, setAds] = useState<IAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<IAd[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "finished">("all");

  const [editAd, setEditAd] = useState<IAd | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  type FilterType = "all" | "pending" | "active" | "finished";

  const load = async () => {
    const data = await getAds();
    setAds(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredAds(ads);
    } else {
      setFilteredAds(ads.filter((ad) => ad.status === filter));
    }
  }, [filter, ads]);

  const handleEdit = (ad: IAd) => {
    setEditAd(ad);
    setEditModal(true);
  };

  return (
      <div className="container-fluid px-md-4">
      <div className="text-center mb-3">
        <Title text="Reklam Yönetimi" subText="Reklam Yönetim Paneli" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <select
          className="form-select"
          style={{ width: 160 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
        >
          <option value="all">Tümü</option>
          <option value="pending">Bekliyor</option>
          <option value="active">Aktif</option>
          <option value="finished">Bitti</option>
        </select>

        <button
          className="btn user-add-btn px-4"
          onClick={() => setCreateModal(true)}
        >
          Reklam Oluştur
        </button>
      </div>

      {/* Liste */}
      <AdsList ads={filteredAds} onEdit={handleEdit} />

      {/* Düzenleme Modal */}
      <AdsEditModal
        show={editModal}
        ad={editAd}
        onClose={() => setEditModal(false)}
        onSaved={load}
      />

      {/* Oluşturma Modal */}
      <AdsCreateModal
        show={createModal}
        onClose={() => setCreateModal(false)}
        onSaved={load}
      />
    </div>
  );
};

export default AdsManagement;
