import {gql} from "@apollo/client";
//QUERIES
export const GET_FILE = gql`
  query GetFile($filename: String!) {
    getImage(filename: $filename) {
      contentType
      content
    }
  }`;

export const GET_MESSAGES_BY_RECEIVER_AND_AUTHOR = gql`
  query GetMessagesByRecieverAndAuthor($receiver: String!, $author: String!) {
    byReceiverAndAuthor(receiver: $receiver, author: $author) {
      id
      author
      receiver
      content
      date
    }
  }`;

export const GET_SELLERS = gql`
query MyQuery {
  sellers {
    id
    image
    name
  }
}`;

export const GET_USERS = gql`
  query GetUsers {
  users {
    active
    email
    id
    nick
    picture
    role
    deleted
    friends {
      active
      email
      id
      nick
      picture
      role
    }
  }
}`;

export const GET_COMPONENTS = gql`
  query GetComponents {
  components {
    amazon_price
    ebay_price
    description
    image
    id
    name
    price
    sellerName
    type
    userNick
    deleted
    priceHistory {
      amazonPrice
      date
      id
      ebayPrice
      price
    }
  }
}
`;
export const GET_BUILDS = gql`
  query GetBuilds {
  builds {
    name
    category
    id
    notes
    totalPrice
    userNick
    deleted
    buildsComponents {
      dateCreated
      priceAtTheTime
      component {
        amazon_price
        description
        ebay_price
        id
        image
        name
        price
        sellerName
        type
        userNick
        deleted
        priceHistory {
          amazonPrice
          date
          ebayPrice
          id
          price
        }
      }
    }
  }
}
`;

export const GET_POSTS = gql`
    query GetPosts {
    posts {
        description
        image
        id
        title
        deleted
        user {
            id
            nick
            email
            role
            picture
            active
            deleted
        }
        build {
            id
            name
            category
            notes
            totalPrice
            userNick
            deleted
            buildsComponents {
                dateCreated
                priceAtTheTime
                component {
                    amazon_price
                    description
                    ebay_price
                    id
                    image
                    name
                    price
                    sellerName
                    type
                    userNick
                    deleted
                    priceHistory {
                        amazonPrice
                        date
                        ebayPrice
                        id
                        price
                    }
                }
            }
        }
        usersWhoLiked {
            id
            nick
            email
            role
            picture
            active
        }
    }
}
`;

export const GET_GROUPS = gql`
    query GetGroups {
        groupChats {
            id
            name
            description
            picture
            admin {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            dateOfCreation            
            users {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            deleted
        }
    }`;
//USERS MUTATIONS
export const SAVE_USER = gql`
  mutation SaveUser($user: UserSaveDTO!) {
    saveUser(user: $user) {
      id
      nick
      email
      role
      picture
      active
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $user: UserUpdateDTO!) {
    updateUser(id: $id, user: $user) {
      id
      nick
      email
      role
      picture
      active
    }
  }
`;
export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;
//COMPONENTS MUTATIONS
export const SAVE_COMPONENT = gql`
  mutation SaveComponent($component: ComponentDTO!) {
    saveComponent(component: $component) {
      id
      name
      description
      price
      type
      image
      sellerName
      amazon_price
      ebay_price
    }
  }
`;
export const UPDATE_COMPONENT = gql`
  mutation UpdateComponent($id: Int!, $component: ComponentDTO!) {
  updateComponent(id: $id, component: $component) {
    id
    name
    description
    image
    type
    price
    amazon_price
    ebay_price
    sellerName
  }
}
`;
export const DELETE_COMPONENT = gql`
    mutation DeleteComponent($id: Int!) {
    deleteComponent(id: $id)
    }
    `;
//BUILDS MUTATIONS
export const SAVE_BUILD = gql`
  mutation SaveBuild($build: BuildDTO!) {
  saveBuild(build: $build) {
    id
    name
    notes
    category
    userNick
    totalPrice
    buildsComponents {
      dateCreated
      priceAtTheTime
      component {
        id
        name
        type
        price
        sellerName
      }
    }
  }
}
`;
export const DELETE_BUILD = gql`
    mutation DeleteBuild($id: Int!) {
    deleteBuild(id: $id)
    }
    `;
export const UPDATE_BUILD = gql`
    mutation UpdateBuild($id: Int!, $build: BuildDTO!) {
  updateBuild(id: $id, build: $build) {
    id
    name
    notes
    category
    userNick
    totalPrice
    buildsComponents {
      dateCreated
      priceAtTheTime
      component {
        id
        name
        type
        price
        sellerName
      }
    }
  }
}
`;
//POSTS MUTATIONS
export const UPDATE_POST = gql`
    mutation UpdatePost($id: Int!, $post: PostDTO!) {
        updatePost(id: $id, post: $post) {
            id
            title
            description
            image
            user {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            build {
                id
                name
                category
                notes
                totalPrice
                userNick
                deleted
                buildsComponents {
                    dateCreated
                    priceAtTheTime
                    component {
                        id
                        name
                        type
                        price
                        sellerName
                    }
                }
            }
            usersWhoLiked {
            id
            nick
            email
            role
            picture
            active
            }
        }
    }`;

export const DELETE_POST = gql`
    mutation DeletePost($id: Int!) {
        deletePost(id: $id)
    }`;

//GROUPS MUTATIONS
export const UPDATE_GROUP = gql`
    mutation UpdateGroup($id: Int!, $groupChat: GroupChatDTO!) {
        updateGroupChat(id: $id, groupChat: $groupChat) {
            id
            name
            description
            picture
            admin {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            dateOfCreation
            users {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            deleted
        }
    }`;

export const DELETE_GROUP = gql`
    mutation DeleteGroup($id: Int!) {
        deleteGroupChat(id: $id)
    }`;

export const ADD_REMOVE_USER_GROUP = gql`
    mutation AddRemoveUserGroup($groupId: Int!, $userId: Int!) {
        addRemoveUserGroupChat(groupId: $groupId, userId: $userId) {
            id
            name
            description
            picture
            admin {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            dateOfCreation
            users {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            deleted
        }
    }`;

export const ADD_REMOVE_ADMIN_GROUP = gql`
    mutation AddRemoveAdminGroup($groupId: Int!, $userId: Int!) {
        addRemoveAdminGroupChat(groupId: $groupId, userId: $userId) {
            id
            name
            description
            picture
            admin {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            dateOfCreation
            users {
                id
                nick
                email
                role
                picture
                active
                deleted
            }
            deleted
        }
    }`;