let posenet;
let pose;
let video;
let skeleton;
let conf = 0.4;

function setup() {
  createCanvas(600, 600);
  video = createCapture(VIDEO);
  video.hide()
  posenet = ml5.poseNet(video, loaded);
  posenet.on('pose', gotPose);
}


function gotPose(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function loaded() {
  console.log("PoseNet is Ready");
}



function draw() {
  image(video, 0, 0);
  getAndSet("<b>No Danger Detected!</b>", "<b>Going Good!</b>");
  cl = document.getElementById("c1")
  c1.outerHTML = c1.outerHTML.replace("e0774a", "6ceb63");
  c2 = document.getElementById("c2")
  c2.outerHTML = c2.outerHTML.replace("e0774a", "6ceb63");

  if (pose) {
    fill(255, 0, 0);
    eyeL = pose.leftEye;
    eyeR = pose.rightEye;
    if (eyeL.confidence > conf && eyeR.confidence > conf) {
      d = dist(eyeL.x, eyeL.y, eyeR.x, eyeR.y);
    } else {
      d = 64;
    }

    for (let i = 0; i < pose.keypoints.length; i++) {
      fill(0, 255, 255);
      let c = pose.keypoints[i].score;
      if (c > conf) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        ellipse(x, y, d / 5);
      }
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0].position;
      let b = skeleton[i][1].position;
      strokeWeight(3);
      stroke(255);
      line(a.x, a.y, b.x, b.y);
    }

    // right shoulder and right hip

    // OVERHEAD INJURIES 

    resh = calcAngle(pose.rightElbow, pose.rightShoulder, pose.rightHip);
    if (resh) {
      if (resh > 130) {
        getAndSet("Potentially Dangerous Pose!", "Move your arms Lower!");
        console.log("Potentially Dangerous Pose!")
        console.log("Move your right arm Lower!");
      }
    }

    lesh = calcAngle(pose.leftElbow, pose.leftShoulder, pose.leftHip);
    if (lesh) {
      if (lesh > 130) {
        getAndSet("Potentially Dangerous Pose!", "Move your arms Lower!");
        console.log("Potentially Dangerous Pose!");
        console.log("Move your left arm Lower!");
      }
    }

    if (pose.rightElbow.y < pose.rightShoulder.y) {
      rwes = calcAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder);
      if (rwes) {
        console.log("RIGHT ELBOW AND WRIST: ", rwes);
        if (rwes < 90) {
          getAndSet("Potentially Dangerous Pose!", "Extend your arms more!");
          console.log("Potentially Dangerous Pose!");
          console.log("Extend your right arm more!");
        }
      }
    }

    if (pose.leftElbow.y < pose.leftShoulder.y) {
      lwes = calcAngle(pose.leftWrist, pose.leftElbow, pose.leftShoulder);
      if (lwes) {
        console.log("LEFT ELBOW AND WRIST: ", lwes);
        if (lwes < 90) {
          getAndSet("Potentially Dangerous Pose!", "Extend your arms more!");
          console.log("Potentially Dangerous Pose!");
          console.log("Extend your left arm more!");
        }
      }

    }

    // BENDING INJURIES
    rshk = calcAngle(pose.rightShoulder, pose.rightHip, pose.rightKnee);
    if (rshk) {
      console.log("RIGHT BEND: ", rshk);
      if (rshk < 50) {
        console.log("Potentially Dangerous Pose!", "Stand back up straight slowly!");
        console.log("Potentially Dangerous Pose!");
        console.log("Stand back up straight slowly!");
      }
    }

    lshk = calcAngle(pose.leftShoulder, pose.leftHip, pose.leftKnee);
    if (lshk) {
      console.log("LEFT BEND: ", lshk);
      if (lshk < 50) {
        console.log("Potentially Dangerous Pose!", "Stand back up straight slowly!");
        console.log("Potentially Dangerous Pose!");
        console.log("Stand back up straight slowly!");
      }
    }
  }
}

function calcAngle(p1, pivot, p2) {
  if (pivot.confidence > conf && p1.confidence > conf && p2.confidence > conf) {
    slope1 = (pivot.y - p1.y) / (pivot.x - p1.x);
    slope2 = (pivot.y - p2.y) / (pivot.x - p2.x);

    angle = Math.abs(Math.atan(slope1) - Math.atan(slope2));
    return 180 - degrees(angle);
  }
  return null;
}

function degrees(angle) {
  return angle * (180 / Math.PI);
}

function getAndSet(dangerText, infoText) {
  danger = document.getElementById("showDanger");
  info = document.getElementById("showInfo");
  danger.innerHTML = `<b> ${dangerText} </b>`;
  info.innerHTML = `<b> ${infoText} </b>`;
  cl = document.getElementById("c1")
  c1.outerHTML = c1.outerHTML.replace("6ceb63", "e0774a");
  c2 = document.getElementById("c2")
  c2.outerHTML = c2.outerHTML.replace("6ceb63", "e0774a");
  
}