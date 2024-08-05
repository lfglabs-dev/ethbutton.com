import React, { FunctionComponent } from "react";
import Card from "../card";
import RetweetIcon from "../iconComponents/retweetIcon";
import CommentIcon from "../iconComponents/commentIcon";
import styles from "../../styles/components/card.module.css";
import Button from "../button";
import eligibilityStyles from "../../styles/eligibility.module.css";

type VerificationStepsProps = {
  next: () => void;
};

const VerificationSteps: FunctionComponent<VerificationStepsProps> = ({
  next,
}) => {
  const [retweetDone, setRetweetDone] = React.useState(false);
  const [commentDone, setCommentDone] = React.useState(false);
  const [loadingRetweet, setLoadingRetweet] = React.useState(false);
  const [loadingComment, setLoadingComment] = React.useState(false);

  const handleRetweet = () => {
    setLoadingRetweet(true);
    window.open(process.env.NEXT_PUBLIC_RETWEET_URL);
    setTimeout(() => {
      setRetweetDone(true);
      setLoadingRetweet(false);
    }, 10000);
  };

  const handleComment = () => {
    setLoadingComment(true);
    window.open(process.env.NEXT_PUBLIC_COMMENT_URL);
    setTimeout(() => {
      setCommentDone(true);
      setLoadingComment(false);
    }, 10000);
  };

  return (
    <div className={styles.cardsContainer}>
      <Card
        completed={retweetDone}
        loading={loadingRetweet}
        buttonText="Retweet Now"
        buttonIcon={<RetweetIcon color="#C8CCD3" width="16" />}
        showButtonDone={true}
        onClick={handleRetweet}
      >
        Retweet our launch tweet
      </Card>
      <Card
        completed={commentDone}
        loading={loadingComment}
        buttonText="Reply Now"
        buttonIcon={<CommentIcon color="#C8CCD3" width="16" />}
        showButtonDone={true}
        onClick={handleComment}
      >
        Comment on our launch tweet
      </Card>
      {retweetDone && commentDone && (
        <div className={eligibilityStyles.verifyButton}>
          <Button onClick={next}>Verify</Button>
        </div>
      )}
    </div>
  );
};

export default VerificationSteps;
