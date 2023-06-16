import React, { useMemo } from "react";

import "semantic-ui-css/semantic.min.css";

import { Container, Menu } from "semantic-ui-react";
import { useRouter } from "next/router";

export default (props) => {
  const router = useRouter();

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
    </Container>
  );
};
