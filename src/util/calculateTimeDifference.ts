export const calculateTimeDifference = (time: Date) => {
  const currentTime: Date = new Date();
  const sentTime: Date = new Date(time);
  const difference: number = currentTime.getTime() - sentTime.getTime();

  const secondDiff: number = Math.floor(difference / 1000);
  const minuteDiff: number = Math.floor(difference / (1000 * 60));
  const hourDiff: number = Math.floor(difference / (1000 * 60 * 60));
  const dayDiff: number = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (secondDiff < 60) {
    return `방금`;
  }

  if (minuteDiff < 60) {
    return `${minuteDiff}분 전`;
  }

  if (hourDiff < 24) {
    return `${hourDiff}시간 전`;
  }

  if (dayDiff < 7) {
    return `${dayDiff}일 전`;
  }

  return `${sentTime.getFullYear()}년 ${sentTime.getMonth()}월 ${sentTime.getDate()}일`;
};
