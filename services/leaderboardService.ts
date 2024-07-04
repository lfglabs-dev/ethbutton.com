const baseurl = process.env.NEXT_PUBLIC_ETH_BUTTON_API;

export const getWinners = async () => {
  try {
    const response = await fetch(`${baseurl}/leaderboard/get_winners`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching winners", err);
  }
};

export const getUserData = async (addr: string) => {
  try {
    const response = await fetch(
      `${baseurl}/leaderboard/get_user_data?addr=${addr}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching user result", err);
  }
};
