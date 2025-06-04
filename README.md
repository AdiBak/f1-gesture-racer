# 🏎️ F1 Gesture Racer

**F1 Gesture Racer** is an experimental 3D racing game controlled entirely with hand gestures using your webcam. Instead of a traditional keyboard or controller, players accelerate, brake, and steer with intuitive hand movements — bringing computer vision and racing together in a futuristic web experience.

![Demo Screenshot](./screenshots/demo.png)

## 🎮 How It Works

- **Pinch/Release** – Brake/Accelerate
- **Rotate Hands Left / Right** – Steer left or right
- **Persistent Tracking** – Uses real-time hand tracking with TensorFlow.js and MediaPipe
- **Web-based** – Built with React, Three.js, and Rapier Physics to run smoothly in your browser

## 🛠️ Technologies Used

- **Frontend:** React, Three.js, TailwindCSS
- **Physics Engine:** Rapier
- **Hand Tracking:** TensorFlow.js, MediaPipe Hands

## 🚧 Current Features (In Progress)

- [x] Gesture-based throttle and brake
- [x] Basic steering with hand rotation
- [x] 3D track and F1 car model
- [x] Mini webcam feed overlay
- [x] Chase camera that follows the car
- [x] Visual feedback for gestures
- [ ] Lap timer and scoring system
- [ ] Collision handling improvements
- [ ] Sound and music integration
- [ ] Opponent AI

## 📦 Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/f1-gesture-racer.git
   cd f1-gesture-racer
