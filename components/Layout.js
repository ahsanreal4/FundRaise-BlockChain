import React, { useMemo, useEffect, useState } from "react";

import "semantic-ui-css/semantic.min.css";

import { Container, Menu, Message } from "semantic-ui-react";
import { useRouter } from "next/router";

export default (props) => {
  const router = useRouter();

  const [showMetamaskError, setShowMetamaskError] = useState(false);

  useEffect(() => {
    if (!window.web3?.currentProvider) {
      setShowMetamaskError(true);
    }
  }, []);

  const header = useMemo(
    () => (
      <Menu style={{ marginTop: "10px" }}>
        <Menu.Item onClick={() => router.push("/")}>FundRaise</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item onClick={() => router.push("/")}>Campaigns</Menu.Item>
          <Menu.Item onClick={() => router.push("/campaigns/create")}>
            +
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    ),
    []
  );

  return (
    <Container>
      {header}
      {props.children}
      {showMetamaskError ? (
        <Message
          error
          header="Metamask extension was not detected!"
          content={
            "Please install the extension and connect to the site before making transactions."
          }
        />
      ) : null}
    </Container>
  );
};
