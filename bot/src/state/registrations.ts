export interface RegistrationStage {
  type: "input" | "photo";
  question: string;
  stageName: string;
  payload?: string;
}

export interface RegistrationStageResult {
  data: string;
}

export interface RegistrationStateItem {
  userId: number;
  eventName: string;
  stages: RegistrationStage[];
  stageResults: RegistrationStageResult[];
  stageId: number;
}

export const registrations: RegistrationStateItem[] = [];

const getRegistration = (userId: number) => {
  return registrations.find((registration) => userId === registration.userId);
};

const getCurrentRegistrationStage = (userId: number) => {
  const registration = getRegistration(userId);
  return registration?.stages[registration.stageId];
};

const nextRegistration = (
  userId: number,
  registrationStageResult: RegistrationStageResult
) => {
  const registration = getRegistration(userId);
  if (!registration) return;
  registration.stageResults.push(registrationStageResult);
  registration.stageId += 1;
};

const isEndOfRegistration = (userId: number) => {
  const registration = getRegistration(userId);
  return registration?.stages.length === registration?.stageResults.length;
};

const removeRegistration = (userId: number) => {
  const index = registrations.findIndex((registration) => registration.userId === userId);
  if (index !== -1) registrations.splice(index, 1);
};

const startRegistration = (
  userId: number,
  eventName: string,
  stages: RegistrationStage[]
) => {
  removeRegistration(userId);
  registrations.push({
    userId,
    eventName,
    stages,
    stageResults: [],
    stageId: 0,
  });
};

export const endRegistration = (userId: number) => {
  const registration = getRegistration(userId);
  const registrationResult = (
    getRegistration(userId)?.stageResults || []
  ).reduce((acc, elem, index) => {
    if (typeof registration?.stages[index].stageName === "string") {
      return {
        ...acc,
        [registration?.stages[index].stageName]: elem.data,
      };
    } else {
      return {};
    }
  }, {} as Record<string, string>);
  removeRegistration(userId);
  return registrationResult;
};

export const initRegistrations = () => {
  return {
    registrations,
    getRegistration,
    nextRegistration,
    isEndOfRegistration,
    endRegistration,
    startRegistration,
    getCurrentRegistrationStage,
    removeRegistration,
  };
};
