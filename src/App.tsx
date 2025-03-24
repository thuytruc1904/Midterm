import React, { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import "./App.css";

const App: React.FC = () => {
  const [birthYear, setBirthYear] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const calculateAge = () => {
    if (!birthYear) return;
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - parseInt(birthYear, 10);
    setAge(calculatedAge);
    sendNotification(calculatedAge);
  };

  const sendNotification = async (calculatedAge: number) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Kết quả tính tuổi",
          body: `Bạn ${calculatedAge} tuổi!`,
          id: 1,
        },
      ],
    });
  };

  const shareResult = async () => {
    if (age !== null) {
      await Share.share({
        title: "Kết quả tính tuổi",
        text: `Tôi ${age} tuổi!`,
        dialogTitle: "Chia sẻ kết quả",
      });
    }
  };

  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
    });
    setPhoto(image.webPath || null);
  };

  return (
    <div className="app-container">
      <h1 className="title">Ứng dụng tính tuổi</h1>
      <input
        type="number"
        placeholder="Nhập năm sinh"
        value={birthYear}
        onChange={(e) => setBirthYear(e.target.value)}
        className="input-field"
      />
      <button onClick={calculateAge} className="btn btn-calculate">Tính tuổi</button>
      {age !== null && <p className="result">Bạn {age} tuổi!</p>}
      <button onClick={shareResult} className="btn btn-share">Chia sẻ kết quả</button>
      <button onClick={takePhoto} className="btn btn-camera">Chụp ảnh</button>
      {photo && <img src={photo} alt="User" className="photo-preview" />}
    </div>
  );
};

export default App;