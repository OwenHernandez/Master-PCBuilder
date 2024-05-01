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

export const GET_SELLER = gql`
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
    friends {
      active
      email
      id
      nick
      picture
      role
    }
  }
}
  `;
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
