/* eslint-disable no-empty */
import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Report {
  id: string;
  createdAt: string;
  reason: string;
  reportedPlate: string;
  reportedUserEmail: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterUserEmail: string;
  reporterUserId: string;
  reporterUserName: string;
}

const ReportsScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "reports"));
        const data: Report[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          let createdAt = d.createdAt;
          if (createdAt && typeof createdAt === "object" && createdAt.seconds) {
            createdAt = new Date(createdAt.seconds * 1000).toLocaleString();
          }
          return {
            id: doc.id,
            createdAt,
            reason: d.reason ?? "",
            reportedPlate: d.reportedPlate ?? "",
            reportedUserEmail: d.reportedUserEmail ?? "",
            reportedUserId: d.reportedUserId ?? "",
            reportedUserName: d.reportedUserName ?? "",
            reporterUserEmail: d.reporterUserEmail ?? "",
            reporterUserId: d.reporterUserId ?? "",
            reporterUserName: d.reporterUserName ?? "",
          };
        });
        setReports(data);

        // Şikayet edilenlerin emaili eksik olanlar için userId'den email çek
        const missingEmailUserIds = data
          .filter(r => !r.reportedUserEmail && r.reportedUserId)
          .map(r => r.reportedUserId);
        const emails: Record<string, string> = {};
        await Promise.all(missingEmailUserIds.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, "user", uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.email) emails[uid] = userData.email;
            }
          } catch {}
        }));
        setUserEmails(emails);
      } catch (error) {
        console.error("Şikayet raporları alınamadı:", error);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <div className="container-fluid px-3 px-md-5">
      <div className="row mb-4">
        <div className="col-12">
          <Title text="Şikayet Raporları" subText="Kullanıcılar tarafından bildirilen şikayetler" />
        </div>
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Tarih</th>
                <th>Plaka</th>
                <th>Şikayet Nedeni</th>
                <th>Şikayet Eden</th>
                <th>Şikayet Edilen</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt}</td>
                  <td>{r.reportedPlate}</td>
                  <td>{r.reason}</td>
                  <td>
                    {r.reporterUserName}
                    <br />
                    <small>{r.reporterUserEmail}</small>
                  </td>
                  <td>
                    {r.reportedUserName}
                    <br />
                    <small>{r.reportedUserEmail || userEmails[r.reportedUserId] || <span className="text-muted">(bulunamadı)</span>}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsScreen;
