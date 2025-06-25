# 🏎️ F1 Gesture Racer

**F1 Gesture Racer** is an experimental 3D racing simulator controlled entirely with hand gestures using your webcam. Instead of a traditional keyboard or controller, you can accelerate, brake, and steer with intuitive hand movements — bringing computer vision and racing together in a futuristic web experience.

Here's a quick demo:

https://github.com/user-attachments/assets/144c32d5-b3d6-4129-b1e0-f31d65c01ec1


## 🎮 How It Works

- **Pinch/Release** – Brake/Accelerate
- **Rotate Hands Left / Right** – Steer left or right
- **Persistent Tracking** – Uses real-time hand tracking with TensorFlow.js and MediaPipe
- **Web-based** – Built with React, Three.js, and Rapier Physics to run smoothly in your browser

## 🛠️ Technologies Used

- **Frontend:** React, Three.js, TailwindCSS
- **Physics Engine:** Rapier
- **Hand Tracking:** TensorFlow.js, MediaPipe Hands

## 🧪 Development Process

This project began as a fun experiment, borne out of my interest in F1, to see if I could control a car using only my hands. Here's how it's evolved:

1. **Hand Gesture Testing (Proof of Concept)**  
   I started by experimenting with MediaPipe Hands and TensorFlow.js. Initially, I just logged hand landmarks to the console and tracked basic gestures like pinching or rotating. Once that was working, I displayed the gesture feedback visually on the screen.

2. **Building the Visual HUD**  
   I added a simple overlay showing the live webcam feed and drew gesture lines and landmarks using drawing utilities to visualize what the model was detecting in real time.

3. **Integrating the Car and Track**  
   After the gesture controls were somewhat reliable, I imported a basic 3D car model and a simple racetrack. The goal was to translate the recognized gestures into actual vehicle motion.

4. **Physics and Movement**  
   I experimented with different physics engines (Cannon, Rapier) to get realistic but smooth car movement. Initially, collisions caused noticeable jitter, so I optimized the physics settings and used a simpler track layout to stabilize motion.

5. **Camera and UX Improvements**  
   I added a chase camera that follows the car from behind and refined the gesture detection pipeline to make the driving experience smoother. I also began hiding the raw webcam feed and showing only the landmark-based gesture UI.

### 🚧 Current Features (In Progress)

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

This ongoing project has been a great blend of AI, computer vision, and game development — and I'm excited to keep building it!

## 📦 Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/f1-gesture-racer.git
   cd f1-gesture-racer
