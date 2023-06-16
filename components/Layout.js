import React, { useMemo, useState } from "react";

import { Container, Menu } from "semantic-ui-react";

export default (props) => {
  const header = useMemo(
    () => (
      <Menu style={{ marginTop: "10px" }}>
        <Menu.Item>FundRaise</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>Campaigns</Menu.Item>
          <Menu.Item>+</Menu.Item>
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
