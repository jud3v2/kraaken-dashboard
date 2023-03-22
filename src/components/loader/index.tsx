import { BarLoader } from "react-spinners";
import { Stack } from "@mui/material";

const Loader = () => {
    return (
        <Stack sx={{width: '100%'}} justifyContent='center' justifyItems='center'>
            <BarLoader
            color="#000"
            cssOverride={{
                top: '50%',
                left: '50%',
                borderRadius: 2,
                width: '40%',
                marginTop: '20%',
                transform: 'translateX(-50%)'
            }}
            height={6}
            loading
            speedMultiplier={0.8}
            width={200}
            />
        </Stack>
    )
}

export default Loader;