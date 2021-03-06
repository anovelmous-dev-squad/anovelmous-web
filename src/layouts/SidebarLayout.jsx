import React from 'react';
import { Grid, Row, Cell } from 'react-inline-grid';

const SidebarLayout = (props) => {
  return (
    <Grid>
      <Row is="around tablet-start phone-start">
        <Cell is="8 tablet-5 phone-4">
          {props.content}
        </Cell>
        <Cell is="4 tablet-3 phone-4">
          {props.sidebar}
        </Cell>
      </Row>
    </Grid>
  );
};

SidebarLayout.propTypes = {
  content: React.PropTypes.element.isRequired,
  sidebar: React.PropTypes.element.isRequired,
};

export default SidebarLayout;
