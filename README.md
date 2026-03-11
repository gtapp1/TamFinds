![Tamfinds_app_icon_shield_2ecf021456](https://github.com/user-attachments/assets/b46910bc-70d7-45ef-bcd6-3b95e91b3fd8)


# 🦌 TamFinds: FEU Roosevelt Lost & Found
**A dedicated mobile utility for the FEU Roosevelt community to reconnect lost items with their owners.**

![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white)

---

## 🌟 Project Overview
**TamFinds** is a mobile application specifically designed for the students and faculty of **FEU Roosevelt**. It solves the common problem of misplaced belongings on campus by providing a centralized, real-time platform for lost and found reports.

### 🚀 Key Features
* **Snap & Go Reporting:** Take a photo, tag a location (Canteen, Gym, Library), and upload instantly.
* **Live Tamaraw Feed:** Real-time Firestore synchronization to see latest found items.
* **FEU Verified Auth:** Automatically detects `@feuroosevelt.edu.ph` emails for a verified badge.
* **Smart Compression:** Automatic image resizing to save data and storage space.
* **Animated Skeletons:** Professional loading states using Reanimated.

---

## 🛠️ Tech Stack
* **Framework:** React Native (Expo SDK 50+)
* **Language:** TypeScript
* **Styling:** NativeWind (Tailwind CSS for Mobile)
* **Backend:** Firebase (Blaze Plan)
    * **Auth:** Email & Password Provider
    * **Database:** Cloud Firestore (Singapore Region)
    * **Storage:** Firebase Cloud Storage
* **State Management:** React Hooks & Custom `useAuth` provider

---

## 📦 Developer Setup (Step-by-Step)

### 1. Repository Setup
```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/tamfinds.git](https://github.com/YOUR_USERNAME/tamfinds.git)

# Enter project folder
cd tamfinds

# Install all dependencies
npm install

📂 Project Structure
src/api/ - Firebase config and service logic.

src/components/ - Reusable UI (Cards, Skeletons, Buttons).

src/hooks/ - Custom logic like useAuth and useItems.

src/theme/ - Official FEU Roosevelt color palette.

src/types/ - TypeScript interfaces for Items and Users.
