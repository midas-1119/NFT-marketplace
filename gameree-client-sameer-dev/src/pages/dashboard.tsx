import React from 'react'
import withAuthentication from '../hoc/withAuthentication';
import DashbaordModule from '../modules/DashboardModule/DashbaordModule'

const DashboardPage = () => {
  return (
    <DashbaordModule/>
  )
}

export default withAuthentication(DashboardPage);
