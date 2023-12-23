import View from './View';

export function getProgress(job: string) {
  try {
    return new View({ job }).progress;
  } catch (error) {
    return { error };
    Logger.log(error);
  }
}

export function callbackUrl({
  url,
  job,
  callback
}: {
  url: string;
  job?: string;
  callback: string;
}) {
  return `${url}?job=${job || Utilities.getUuid()}&callback=${callback}`;
}
