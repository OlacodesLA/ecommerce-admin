import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? `https://${process.env.NEXT_PUBLIC_LOCAL_FRONTEND}`
    : `https://${process.env.NEXT_PUBLIC_PROD_FRONTEND}`;

const NikeReceiptEmail = ({
  customer,
  shipping,
  totalPrice,
  items,
  createdAt,
}: any) => {
  const { email, phone, firstName, lastName } = customer;
  const { address, city, country } = shipping;
  return (
    <Html>
      <Head />
      <Preview>
        Get your order summary, estimated delivery date and more
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...track.container, padding: "10px 20px" }}>
            <Row>
              <Img
                src={`${baseUrl}/logo.png`}
                width="66"
                height="55"
                alt="Iro Lagos"
                style={{ margin: "auto" }}
              />
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={message}>
            <Heading style={{ ...global.heading, lineHeight: 0.9 }}>
              Order Confirmation
            </Heading>
            <Text style={global.text}>
              {" "}
              {lastName} {firstName}, Thank you for your order.
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              We`ve received your order and would contact you as soon as your
              package is shipped. You can find your purchase information below.
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={message}>
            <Heading
              style={{ ...global.heading, fontSize: "20px", lineHeight: 0.4 }}
            >
              Order Summary
            </Heading>
            <Text style={{ ...global.text, marginBottom: "8px" }}>
              {createdAt}
            </Text>
            {items.map((item: any) => {
              const { name, cartQuantity, price } = item;
              return (
                <Row
                  key={name}
                  style={{ justifyItems: "left", margin: "20px 0px" }}
                >
                  <Column
                    style={{
                      backgroundColor: "#f3f3f3",
                      borderRadius: "10px",
                      width: "150px",
                      height: "50px",
                    }}
                  >
                    <Text
                      style={{
                        ...paragraph,
                        fontWeight: "500",
                        // padding: "1px 30px",
                      }}
                    >
                      {name}
                    </Text>
                  </Column>
                  <Column
                    style={{
                      verticalAlign: "top",
                      paddingLeft: "12px",
                      textAlign: "left",
                    }}
                  >
                    {/* <Text
                      style={{
                        ...paragraph,
                        fontWeight: "500",
                        lineHeight: 1.6,
                      }}
                    >
                      {items}
                    </Text> */}
                    <Text style={{ ...global.text, lineHeight: 1.6 }}>
                      <span
                        style={{
                          ...global.paragraphWithBold,
                          color: "#000000",
                          lineHeight: 1.6,
                        }}
                      >
                        Quantity:{" "}
                      </span>
                      {cartQuantity}
                    </Text>
                    <Text style={{ ...global.text, lineHeight: 1.6 }}>
                      <span
                        style={{
                          ...global.paragraphWithBold,
                          color: "#000000",
                          lineHeight: 1.6,
                        }}
                      >
                        Price:{" "}
                      </span>
                      {price.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </Text>
                  </Column>
                </Row>
              );
            })}
          </Section>
          {/* Order Total */}
          <Section style={message}>
            <Heading
              style={{ ...global.heading, fontSize: "20px", lineHeight: 0.4 }}
            >
              Order Total
            </Heading>

            <Row>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    // padding: "1px 30px",
                    textAlign: "start",
                  }}
                >
                  Sub Total
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    textAlign: "end",

                    // padding: "1px 30px",
                  }}
                >
                  {totalPrice.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    // padding: "1px 30px",
                    textAlign: "start",
                  }}
                >
                  Shipping
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    textAlign: "end",

                    // padding: "1px 30px",
                  }}
                >
                  Pay on delivery
                </Text>
              </Column>
            </Row>
            <Hr style={global.hr} />
            <Row>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    // padding: "1px 30px",
                    textAlign: "start",
                  }}
                >
                  Total
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...paragraph,
                    fontWeight: "500",
                    textAlign: "end",

                    // padding: "1px 30px",
                  }}
                >
                  {totalPrice.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section
            style={{ ...paddingX, paddingTop: "40px", paddingBottom: "40px" }}
          >
            <Heading
              style={{
                ...global.heading,
                fontSize: "20px",
                lineHeight: 0.4,
                marginBottom: "40px",
              }}
            >
              Billing & Shipping Information
            </Heading>
            <Row>
              <Column style={{ verticalAlign: "top" }}>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        fontSize: "17px",
                        marginBottom: "10px",
                        lineHeight: 1.6,
                      }}
                    >
                      Billing
                    </span>
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Name:{" "}
                    </span>
                    {lastName} {firstName}
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Email:{" "}
                    </span>
                    {email}
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Phone:{" "}
                    </span>
                    {phone}
                  </Text>
                </Row>
              </Column>
              <Column>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        fontSize: "17px",
                        color: "#000000",
                        marginBottom: "10px",
                        lineHeight: 1.6,
                      }}
                    >
                      Shipping
                    </span>
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      textAlign: "start",

                      // padding: "1px 30px",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Delivery Address:
                    </span>
                    {address}
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      textAlign: "start",

                      // padding: "1px 30px",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      City:
                    </span>
                    {city}
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Country:{" "}
                    </span>
                    {country}
                  </Text>
                  <Text
                    style={{
                      ...paragraph,
                      fontWeight: "500",
                      // padding: "1px 30px",
                      textAlign: "start",
                    }}
                  >
                    <span
                      style={{
                        ...global.paragraphWithBold,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      Additional Information:{" "}
                    </span>
                    Just deliver man
                  </Text>
                </Row>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            {/* <Text style={adressTitle}>Shipping to: Zeno Rocha</Text>
          <Text style={{ ...global.text, fontSize: 14 }}>
            2125 Chestnut St, San Francisco, CA 94123
          </Text> */}
          </Section>

          <Hr style={global.hr} />
          <Section style={menu.container}>
            <Text style={menu.title}>Get Help</Text>
            {/* <Row style={menu.content}>
            <Column style={{ width: "33%" }} colSpan={1}>
              <Link href="/" style={menu.text}>
                Shipping Status
              </Link>
            </Column>
            <Column style={{ width: "33%" }} colSpan={1}>
              <Link href="/" style={menu.text}>
                Shipping & Delivery
              </Link>
            </Column>
            <Column style={{ width: "33%" }} colSpan={1}>
              <Link href="/" style={menu.text}>
                Returns & Exchanges
              </Link>
            </Column>
          </Row>
          <Row style={{ ...menu.content, paddingTop: "0" }}>
            <Column style={{ width: "33%" }} colSpan={1}>
              <Link href="/" style={menu.text}>
                How to Return
              </Link>
            </Column>
            <Column style={{ width: "66%" }} colSpan={2}>
              <Link href="/" style={menu.text}>
                Contact Options
              </Link>
            </Column>
          </Row>
          <Hr style={global.hr} /> */}
            <Row style={menu.tel}>
              <Column>
                <Row>
                  <Column style={{ width: "16px" }}>
                    <Img
                      src={`${baseUrl}/static/nike-phone.png`}
                      width="16px"
                      height="26px"
                      style={{ paddingRight: "14px" }}
                    />
                  </Column>
                  <Column>
                    <Text style={{ ...menu.text, marginBottom: "0" }}>
                      +2348185513597
                    </Text>
                  </Column>
                </Row>
              </Column>
              <Column>
                <Text
                  style={{
                    ...menu.text,
                    marginBottom: "0",
                  }}
                >
                  10 am - 7 pm (WAT)
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={paddingY}>
            <Text style={global.heading}>irolagos.com</Text>
            <Row style={categories.container}>
              <Column align="center">
                <Link href="/https://irolagos.com" style={categories.text}>
                  Home
                </Link>
              </Column>
              <Column align="center">
                <Link href="https://store.irolagos.com" style={categories.text}>
                  Shop
                </Link>
              </Column>
              <Column align="center">
                <Link href="https://irolagos.com/blog" style={categories.text}>
                  Blog
                </Link>
              </Column>
              <Column align="center">
                <Link
                  href="https://irolagos.com#contact"
                  style={categories.text}
                >
                  Contact
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={{ ...global.hr, marginTop: "12px" }} />
          <Section style={paddingY}>
            <Row style={footer.policy}>
              <Column>
                <Text style={footer.text}>Web Version</Text>
              </Column>
              <Column>
                <Text style={footer.text}>Privacy Policy</Text>
              </Column>
            </Row>
            <Text style={{ ...footer.text, paddingTop: 30, paddingBottom: 30 }}>
              Please contact us if you have any questions. (If you reply to this
              email, we won`t be able to see it.)
            </Text>
            <Text style={footer.text}>
              © 2023 Iro Lagos. All Rights Reserved.
            </Text>
            <Text style={footer.text}>
              Iro Lagos. 7-12 Rumens Rd, Ikoyi 101233, Lagos
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
export default NikeReceiptEmail;

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  border: "1px solid #E5E5E5",
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const recomendationsText = {
  margin: "0",
  fontSize: "15px",
  lineHeight: "1",
  paddingLeft: "10px",
  paddingRight: "10px",
};

const recomendations = {
  container: {
    padding: "20px 0",
  },
  product: {
    verticalAlign: "top",
    textAlign: "left",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  title: { ...recomendationsText, paddingTop: "12px", fontWeight: "500" },
  text: {
    ...recomendationsText,
    paddingTop: "4px",
    color: "#747474",
  },
};

const menu = {
  container: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
    backgroundColor: "#F7F7F7",
  },
  content: {
    ...paddingY,
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  title: {
    paddingLeft: "20px",
    paddingRight: "20px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "13.5px",
    marginTop: 0,
    fontWeight: 500,
    color: "#000",
  },
  tel: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "32px",
    paddingBottom: "22px",
  },
};

const categories = {
  container: {
    width: "370px",
    margin: "auto",
    paddingTop: "12px",
  },
  text: {
    fontWeight: "500",
    color: "#000",
  },
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  } as React.CSSProperties,
};
