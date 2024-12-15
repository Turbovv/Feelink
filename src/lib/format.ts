export const formatDate = (isoDate: string, displayTimeAndDate: boolean = false): string => {
  const postDate = new Date(isoDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneMonth = 30 * oneDay;

  if (displayTimeAndDate) {
    const time = postDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const date = postDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${time} · ${date}`;
  } else {
    if (timeDifference < oneDay) {
      const secondsAgo = Math.floor(timeDifference / 1000);
      const minutesAgo = Math.floor(timeDifference / (60 * 1000));
      const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
      
      if (secondsAgo < 60) {
        return `${secondsAgo}s ago`;
      } else if (minutesAgo < 60) {
        return `${minutesAgo}min ago`;
      } else {
        return `${hoursAgo}h ago`;
      }
    } else if (timeDifference < oneMonth) {
      const daysAgo = Math.floor(timeDifference / oneDay);
      return `${daysAgo}d ago`;
    } else {
      const month = postDate.toLocaleString("en-US", { month: "short" });
      const year = postDate.getFullYear();
      return `${month} ${year}`;
    }
  }
};
