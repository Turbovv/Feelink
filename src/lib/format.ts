export const formatDate = (isoDate: string): string => {
    const postDate = new Date(isoDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
  
    if (timeDifference < oneDay) {
      const secondsAgo = Math.floor(timeDifference / 1000);
      const minutesAgo = Math.floor(timeDifference / (60 * 1000));
      const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
  
      if (secondsAgo < 60) {
        return `${secondsAgo}s`;
      } else if (minutesAgo < 60) {
        return `${minutesAgo}min`;
      } else {
        return `${hoursAgo}h`;
      }
    } else {
      return postDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };
  