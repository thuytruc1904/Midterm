import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./App.css";

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);

  const displayTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
    sendNotification(formattedTime);
  };

  const sendNotification = async (time: string) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Thời gian hiện tại",
            body: `Bây giờ là: ${time}`,
            id: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi gửi thông báo: ", error);
    }
  };

  const shareTime = async () => {
    if (currentTime) {
      try {
        await Share.share({
          title: "Thời gian hiện tại",
          text: `Bây giờ là: ${currentTime}`,
          dialogTitle: "Chia sẻ thời gian",
        });
      } catch (error) {
        console.error("Lỗi chia sẻ: ", error);
      }
    }
  };

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // Sửa lại
        quality: 90,
      });
      
      setPhoto(image.webPath || null);
    } catch (error) {
      console.error("Lỗi chụp ảnh: ", error);
      alert("Không thể chụp ảnh!");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">HIỂN THỊ THỜI GIAN</h1>
      <button onClick={displayTime} className="btn btn-time">Hiển thị thời gian</button>
      {currentTime && <p className="time">Bây giờ là: {currentTime}</p>}
      <button onClick={shareTime} className="btn btn-share">Chia sẻ thời gian</button>
      <button onClick={takePhoto} className="btn btn-camera">Chụp ảnh</button>
      {photo && <img src={photo} alt="Chụp ảnh" className="photo-preview" />}
    </div>
  );
};

export default App;