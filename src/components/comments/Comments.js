import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";

import classes from "./Comments.module.css";
import CommentsList from "./CommentsList";
import NewCommentForm from "./NewCommentForm";

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();
  const { quoteId } = params;
  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  const {
    sendRequest,
    status,
    data: loadedComments,
    error,
  } = useHttp(getAllComments);
  const addedCommentHandler = useCallback(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);
  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);
  let comments;
  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    comments = <p className="centered focued">{error}</p>;
  }
  if (status === "completed" && loadedComments) {
    comments = <CommentsList comments={loadedComments} />;
  }
  if (
    status === "completed" &&
    (!loadedComments || loadedComments.length === 0)
  ) {
    comments = <p className="centered">no comments were added yet!!</p>;
  }
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {comments}
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}

      {isAddingComment && (
        <NewCommentForm
          quoteId={quoteId}
          onAddedComment={addedCommentHandler}
        />
      )}
    </section>
  );
};

export default Comments;
