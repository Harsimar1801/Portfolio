import { defineProjects } from './validate.js'

// Portfolio information supplied by Harsimar. Empty URLs mean unavailable.
export const projects = defineProjects([
  {
    "id": "deployx",
    "title": "DeployX — Self-Service Application Deployment Platform",
    "shortDescription": "Automating application deployment from GitHub.",
    "description": "A Vercel-inspired application deployment platform designed to automate deployment from GitHub repositories. The React dashboard is substantially developed; the backend and complete deployment infrastructure still require implementation and verification. Planned capabilities include repository integration, automated builds, status tracking, build logs, health checks, and isolated container deployments. The intended architecture separates dashboard, APIs, deployment processing, artifact storage, and application serving.",
    "detailedDescription": "A Vercel-inspired application deployment platform designed to automate deployment from GitHub repositories. The React dashboard is substantially developed; the backend and complete deployment infrastructure still require implementation and verification. Planned capabilities include repository integration, automated builds, status tracking, build logs, health checks, and isolated container deployments. The intended architecture separates dashboard, APIs, deployment processing, artifact storage, and application serving.",
    "technologies": [
      "React",
      "Node.js",
      "Express.js",
      "Docker"
    ],
    "category": "Deployment",
    "status": "IN DEVELOPMENT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": true
  },
  {
    "id": "ai-interview-analyzer",
    "title": "AI Interview Performance Analyzer",
    "shortDescription": "AI-assisted mock interview feedback.",
    "description": "An AI-assisted interview practice platform intended to analyze mock interview videos and provide personalized feedback. The planned workflow considers confidence, communication, speaking pace, and eye contact through frontend, backend, and AI-service integration. These analysis capabilities are in development and have not all been implemented or validated.",
    "detailedDescription": "An AI-assisted interview practice platform intended to analyze mock interview videos and provide personalized feedback. The planned workflow considers confidence, communication, speaking pace, and eye contact through frontend, backend, and AI-service integration. These analysis capabilities are in development and have not all been implemented or validated.",
    "technologies": [
      "React",
      "Node.js",
      "Python",
      "AI integration"
    ],
    "category": "AI Applications",
    "status": "IN DEVELOPMENT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": true
  },
  {
    "id": "patient-health-hub",
    "title": "Patient Health Hub",
    "shortDescription": "Making healthcare information more accessible.",
    "description": "An AI-assisted healthcare information platform designed to help users interpret prescription images, understand medicines, and discover healthcare professionals. Planned capabilities include image upload, OCR text extraction, medicine-name recognition and correction, confidence scores, medicine information, side effects, precautions, and professional discovery. These are planned capabilities, not confirmed implementations. The platform is intended to provide information without independently diagnosing diseases.",
    "detailedDescription": "An AI-assisted healthcare information platform designed to help users interpret prescription images, understand medicines, and discover healthcare professionals. Planned capabilities include image upload, OCR text extraction, medicine-name recognition and correction, confidence scores, medicine information, side effects, precautions, and professional discovery. These are planned capabilities, not confirmed implementations. The platform is intended to provide information without independently diagnosing diseases.",
    "technologies": [
      "React",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "OCR",
      "AI services (planned)"
    ],
    "category": "Healthcare",
    "status": "PLANNED / IN PROGRESS",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": true
  },
  {
    "id": "computer-vision-object-detection",
    "title": "Computer Vision and Object Detection",
    "shortDescription": "Exploring model-based visual recognition.",
    "description": "A computer vision project exploring object detection and image processing using OpenCV and YOLOv3. The work involved object-detection functionality, hand-detection concepts, and model-based visual recognition workflows using the COCO dataset. No custom model training, production deployment, or benchmark performance is claimed.",
    "detailedDescription": "A computer vision project exploring object detection and image processing using OpenCV and YOLOv3. The work involved object-detection functionality, hand-detection concepts, and model-based visual recognition workflows using the COCO dataset. No custom model training, production deployment, or benchmark performance is claimed.",
    "technologies": [
      "Python",
      "OpenCV",
      "YOLOv3",
      "COCO Dataset"
    ],
    "category": "Computer Vision",
    "status": "EXPLORATORY PROJECT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  },
  {
    "id": "squat-pose-analyser",
    "title": "Squat Pose Analyser",
    "shortDescription": "Exploring visual information in squat movement.",
    "description": "A pose-analysis project focused on analyzing squat poses using OpenCV, MediaPipe, and machine-learning techniques. It explores visual pose information to understand body movement during a squat. Completion status and specific analysis capabilities have not been confirmed.",
    "detailedDescription": "A pose-analysis project focused on analyzing squat poses using OpenCV, MediaPipe, and machine-learning techniques. It explores visual pose information to understand body movement during a squat. Completion status and specific analysis capabilities have not been confirmed.",
    "technologies": [
      "OpenCV",
      "MediaPipe",
      "Machine Learning"
    ],
    "category": "Computer Vision",
    "status": "EXPLORATORY PROJECT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  },
  {
    "id": "clinic-website",
    "title": "Clinic Website",
    "shortDescription": "A dark-themed healthcare frontend.",
    "description": "A clinic and healthcare website developed to practise frontend development and build a dark-themed healthcare interface. The project provided practical experience in page structure, styling, and frontend implementation. The original version was not fully responsive.",
    "detailedDescription": "A clinic and healthcare website developed to practise frontend development and build a dark-themed healthcare interface. The project provided practical experience in page structure, styling, and frontend implementation. The original version was not fully responsive.",
    "technologies": [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js"
    ],
    "category": "Frontend",
    "status": "FRONTEND PROJECT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  },
  {
    "id": "photography-portfolio",
    "title": "Photography Portfolio",
    "shortDescription": "A visual home for photography.",
    "description": "A personal photography portfolio website presenting photography work through a visually organized interface. The project provided experience in layout, styling, and visual presentation. The original version was not fully responsive.",
    "detailedDescription": "A personal photography portfolio website presenting photography work through a visually organized interface. The project provided experience in layout, styling, and visual presentation. The original version was not fully responsive.",
    "technologies": [
      "HTML",
      "CSS"
    ],
    "category": "Frontend",
    "status": "FRONTEND PROJECT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  },
  {
    "id": "collabhub",
    "title": "CollabHub",
    "shortDescription": "Collaboration-focused interface exploration.",
    "description": "A social-media-style collaboration project focused on the user interface, including login and signup pages. This represents interface and frontend development work, not a verified production backend, complete authentication system, or fully functional social platform.",
    "detailedDescription": "A social-media-style collaboration project focused on the user interface, including login and signup pages. This represents interface and frontend development work, not a verified production backend, complete authentication system, or fully functional social platform.",
    "technologies": [
      "Web development stack"
    ],
    "category": "Frontend",
    "status": "FRONTEND / UI PROJECT",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  },
  {
    "id": "mindcare",
    "title": "MindCare — AI Mental Wellness Companion",
    "shortDescription": "An approachable conversational wellness concept.",
    "description": "A planned conversational mental wellness companion designed around a friendly user experience. Concepts include emotional check-ins, reminders, multilingual interaction, notifications, and proactive daily messages. Development and experimentation have involved frontend technologies, Node.js, and AI API integration exploration using Groq, Gemini, and Sarvam AI. Planned features are not all completed; this is not a medical diagnosis system.",
    "detailedDescription": "A planned conversational mental wellness companion designed around a friendly user experience. Concepts include emotional check-ins, reminders, multilingual interaction, notifications, and proactive daily messages. Development and experimentation have involved frontend technologies, Node.js, and AI API integration exploration using Groq, Gemini, and Sarvam AI. Planned features are not all completed; this is not a medical diagnosis system.",
    "technologies": [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Groq API exploration",
      "Gemini API exploration",
      "Sarvam AI exploration"
    ],
    "category": "AI Applications",
    "status": "CONCEPT / PROTOTYPE",
    "github": "",
    "liveDemo": "",
    "image": "",
    "featured": false
  }
])
