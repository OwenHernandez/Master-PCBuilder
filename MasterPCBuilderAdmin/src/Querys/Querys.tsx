import {gql} from "@apollo/client";

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
