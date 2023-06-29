import React from "react";
import withAuthentication from "../hoc/withAuthentication";
import AddPrpertyModule from "../modules/AddProperty/AddPropertyModule";
import Head from "next/head";

const AddProperty = () => {
  return (
    <>
      <Head>
        <title>Add Property | Gameree</title>
      </Head>
      <AddPrpertyModule />
    </>
  );
};

export default withAuthentication(AddProperty);
