import View from './View';

export function getProgress(job: string) {
  try {
    return new View({ job }).progress;
  } catch (error) {
    return { error };
    Logger.log(error);
  }
}
