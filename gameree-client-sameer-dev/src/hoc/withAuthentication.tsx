import { useSelector } from "react-redux";
import { selectToken } from "../store/auth/selector";
import { useRouter } from "next/router";

const withAuthentication = (Component: any) => {
  const Auth = (props: any) => {
    const router = useRouter();
    
    let access_token = useSelector(selectToken);
    console.log(selectToken, 'selectToken');
    
    // If user is not logged in, return login component
  if (!access_token) {
      router.push('/')
    } else return <Component {...props} />
 
    return ( 
      <>
        <div className="AtLoaderOuter">
          <div/>
        </div>
      </>
    )
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuthentication;
