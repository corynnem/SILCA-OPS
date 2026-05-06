
// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────
 
export const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
        name
        role
      }
    }
  }
`;
 
export const CREATE_USER_MUTATION = /* GraphQL */ `
  mutation CreateUser(
    $email: String!
    $name: String!
    $password: String!
    $role: UserRole
  ) {
    createUser(email: $email, name: $name, password: $password, role: $role) {
      _id
      email
      name
      role
    }
  }
`;
 
// ─────────────────────────────────────────────────────────────────────────────
// Sales Orders
// ─────────────────────────────────────────────────────────────────────────────
 
export const SALES_ORDERS_QUERY = /* GraphQL */ `
  query SalesOrders($limit: Int, $offset: Int) {
    salesOrders(limit: $limit, offset: $offset) {
      id
      tranid
      otherrefnum
      trandate
      entity {
        id
        refName
      }
      subsidiary {
        id
        refName
      }
      item {
        items {
          item {
            id
            refName
            sku
          }
          quantity
          amount
        }
      }
    }
  }
`;
 
export const SALES_ORDER_QUERY = /* GraphQL */ `
  query SalesOrder($id: String!) {
    salesOrder(id: $id) {
      id
      tranid
      otherrefnum
      trandate
      entity {
        id
        refName
      }
      subsidiary {
        id
        refName
      }
      item {
        items {
          item {
            id
            refName
            sku
          }
          quantity
          amount
        }
      }
    }
  }
`;
 
export const MARK_ORDER_PICKED_MUTATION = /* GraphQL */ `
  mutation MarkOrderPicked($id: String!) {
    markOrderPicked(id: $id)
  }
`;
 
export const MARK_ORDER_PACKED_MUTATION = /* GraphQL */ `
  mutation MarkOrderPacked($id: String!) {
    markOrderPacked(id: $id)
  }
`;
 
// ─────────────────────────────────────────────────────────────────────────────
// Barcodes
// ─────────────────────────────────────────────────────────────────────────────
 
export const BARCODES_QUERY = /* GraphQL */ `
  query Barcodes($sku: String) {
    barcodes(sku: $sku) {
      _id
      GTIN
      GTIN12
      GTIN13
      GTIN8
      SKU
      brandName
      productDescription
      packagingLevel
      isPurchasable
      statusLabel
      height
      width
      depth
      dimensionMeasure
      grossWeight
      netWeight
      weightMeasure
      targetMarkets
      imageUrl
      lastModifiedDate
    }
  }
`;
 
export const BARCODE_BY_GTIN_QUERY = /* GraphQL */ `
  query BarcodeByGTIN($gtin: Float!) {
    barcodeByGTIN(gtin: $gtin) {
      _id
      GTIN
      GTIN12
      SKU
      brandName
      productDescription
      statusLabel
      isPurchasable
    }
  }
`;