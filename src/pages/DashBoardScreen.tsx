import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import Title from "../components/Title";
import Sparkline from "../components/DashBoardComponents/Sparkline";
import MiniAreaChart from "../components/DashBoardComponents/MiniAreaCahrt";

const DashBoardScreen = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers24h: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    pausedAds: 0,
    premiumUsers: 0,
    newPremium7d: 0,
    totalCars: 0,
    newCars24h: 0,
    totalNotifications: 0,
    newNotifications24h: 0
  });

  const [trends, setTrends] = useState<{
  users: number[];
  premium: number[];
  ads: number[];
  notifications: number[];
  cars: number[];
}>({
  users: [],
  premium: [],
  ads: [],
  notifications: [],
  cars: []
});


const calculateDailyTrend = (
  docs: QueryDocumentSnapshot[],
  field: string
): number[] => {
  const today = new Date();
  const days = Array(7).fill(0);

  docs.forEach((d) => {
    const ts = d.data()[field];
    const ms = ts?.toMillis?.();
    if (!ms) return;

    const diffDays = Math.floor((today.getTime() - new Date(ms).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      days[6 - diffDays]++;
    }
  });

  return days;
};


  const fetchData = async () => {
    try {
      const now = Timestamp.now();
      const dayAgo = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
      const weekAgo = Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000);

      const usersSnap = await getDocs(collection(db, "user"));
      const totalUsers = usersSnap.size;
      const newUsers24h = usersSnap.docs.filter((d) => {
        const createdAt = d.data().createdAt;
        const ms = createdAt?.toMillis?.();
        return ms && ms > dayAgo.toMillis();
      }).length;

      const premiumSnap = await getDocs(
        query(collection(db, "user"), where("isPremium", "==", true))
      );

      const premiumUsers = premiumSnap.size;
      const newPremium7d = premiumSnap.docs.filter((d) => {
        const premiumAt = d.data().premiumStart;
        const ms = premiumAt?.toMillis?.();
        return ms && ms > weekAgo.toMillis();
      }).length;

      const adsSnap = await getDocs(collection(db, "ads"));
      const totalAds = adsSnap.size;
      const activeAds = adsSnap.docs.filter((d) => d.data().status === "active").length;
      const pendingAds = adsSnap.docs.filter((d) => d.data().status === "pending").length;
      const pausedAds = adsSnap.docs.filter((d) => d.data().status === "paused").length;

      const notificationsSnap = await getDocs(
        query(collection(db, "notifications"), where("type", "==", "outgoing"))
      );

      const totalNotifications = notificationsSnap.size;
      const newNotifications24h = notificationsSnap.docs.filter((d) => {
        const t = d.data().timestamp;
        const ms = t?.toMillis?.();
        return ms && ms > dayAgo.toMillis();
      }).length;

      const carsSnap = await getDocs(collection(db, "cars"));
      const totalCars = carsSnap.size;
      const newCars24h = carsSnap.docs.filter((d) => {
        const createdAt = d.data().createdAt;
        const ms = createdAt?.toMillis?.();
        return ms && ms > dayAgo.toMillis();
      }).length;

      const usersTrend = calculateDailyTrend(usersSnap.docs, "createdAt");
      const premiumTrend = calculateDailyTrend(premiumSnap.docs, "premiumStart");
      const carsTrend = calculateDailyTrend(carsSnap.docs, "createdAt");
      const notificationsTrend = calculateDailyTrend(notificationsSnap.docs, "timestamp");
      const adsTrend = calculateDailyTrend(adsSnap.docs, "createdAt");

      setStats({
        totalUsers,
        newUsers24h,
        totalAds,
        activeAds,
        pendingAds,
        pausedAds,
        premiumUsers,
        newPremium7d,
        totalCars,
        newCars24h,
        totalNotifications,
        newNotifications24h
      });

      setTrends({
        users: usersTrend,
        premium: premiumTrend,
        ads: adsTrend,
        notifications: notificationsTrend,
        cars: carsTrend
      });

    } catch (error) {
      console.error("Dashboard fetchData hata:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <div className="container-fluid px-3 px-md-5">
      <div className="row mb-4">
        <div className="col-12">
          <Title text="Dashboard" subText="Gerçek Zamanlı Uygulama İstatistikleri" />
        </div>
      </div>

      <div className="row g-4">

        <div className="col-6 col-md-3">
          <div className="p-4 rounded shadow-sm text-white" style={{ backgroundColor: "var(--primary)" }}>
            <h5 className="mb-1">Toplam Kullanıcı</h5>
            <h2 className="fw-bold">{stats.totalUsers}</h2>
            <div className="opacity-75">Son 24 saatte + {stats.newUsers24h}</div>
            <Sparkline data={trends.users} color="#ffffff" />
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-4 rounded shadow-sm text-black" style={{ backgroundColor: "#fcfcfc" }}>
            <h5 className="mb-1">Toplam Reklam</h5>
            <h2 className="fw-bold">{stats.totalAds}</h2>
            <div className="opacity-75">
              <span className="badge bg-success me-1">Aktif {stats.activeAds}</span>
              <span className="badge bg-secondary me-1">Beklemede {stats.pendingAds}</span>
              <span className="badge bg-danger">Biten {stats.pausedAds}</span>
            </div>
            <Sparkline data={trends.ads} color="#222" />
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-4 rounded shadow-sm text-black" style={{ backgroundColor: "var(--secondary)" }}>
            <h5 className="mb-1">Premium Kullanıcı</h5>
            <h2 className="fw-bold">{stats.premiumUsers}</h2>
            <div className="opacity-80">Son 7 günde + {stats.newPremium7d}</div>
            <Sparkline data={trends.premium} color="#000" />
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-4 rounded shadow-sm text-white" style={{ backgroundColor: "grey" }}>
            <h5 className="mb-1">Gönderilen Bildirim</h5>
            <h2 className="fw-bold">{stats.totalNotifications}</h2>
            <div className="opacity-75">Son 24 saatte + {stats.newNotifications24h}</div>
            <Sparkline data={trends.notifications} color="#ffffff" />
          </div>
        </div>

      </div>

      <div className="row g-3 mt-4">

        <div className="col-12 col-md-6">
          <div className="p-4 rounded shadow-sm border bg-white">
            <h5 className="mb-3">Toplam Kayıtlı Araç</h5>
            <h2 className="fw-bold text-black">{stats.totalCars}</h2>
            <MiniAreaChart data={trends.cars} color="#4b5563" />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="p-4 rounded shadow-sm border bg-white">
            <h5 className="mb-3">Bugün Eklenen Plakalar</h5>
            <h2 className="fw-bold text-black">{stats.newCars24h}</h2>
            <MiniAreaChart data={trends.cars} color="#4b5563" />

          </div>
        </div>

      </div>
    </div>
  );
};

export default DashBoardScreen;
