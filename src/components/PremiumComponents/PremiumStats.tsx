interface Props {
  stats: {
    totalPremium: number;
    expired: number;
  };
}

const PremiumStats = ({ stats }: Props) => {
  return (
    <div className="row g-3 mb-2 justify-content-center">

      <div className="col-12 col-md-4 d-flex justify-content-center">
        <div className="p-3 bg-dark text-white rounded shadow text-center w-100">
          <h4 className="fw-bold">{stats.totalPremium}</h4>
          <p className="m-0">Toplam Premium Kullanıcı</p>
        </div>
      </div>

      <div className="col-12 col-md-4 d-flex justify-content-center" >
        <div className="p-3 bg-grey text-white rounded shadow text-center w-100"   style={{ backgroundColor: "grey" }}
>
          <h4 className="fw-bold">{stats.expired}</h4>
          <p className="m-0">Süresi Dolmuş</p>
        </div>
      </div>

    </div>
  );
};

export default PremiumStats;
