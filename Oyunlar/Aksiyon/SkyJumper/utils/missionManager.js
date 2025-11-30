// Mission management utility

import { MISSION_TYPES } from '../constants/missions';

export class MissionManager {
  static generateMission() {
    const randomMission = MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)];
    return { ...randomMission, progress: 0 };
  }

  static updateMissionProgress(mission, type, increment = 1) {
    if (!mission || mission.type !== type) return mission;

    return {
      ...mission,
      progress: mission.progress + increment
    };
  }

  static isMissionComplete(mission) {
    return mission && mission.progress >= mission.target;
  }

  static getMissionReward(mission) {
    return mission ? mission.reward : 0;
  }
}
