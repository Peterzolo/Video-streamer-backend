import userRoutes from "./user/user.route.js";
import videoRoutes from "./video/video.route.js"
import commentRoutes from "./comment/comment.route.js"


 export const componentModule = {  
  userModule: {
    routes: userRoutes,
  },

  videoModule: {
    routes: videoRoutes,
  },
  commentModule: {
    routes: commentRoutes,  
  },
};

// export default componentModule;
