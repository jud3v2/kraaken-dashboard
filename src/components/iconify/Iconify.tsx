import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------
type Props = {
  icon: any,
  width?: number,
  sx?: any,
  height?: number,
  color?: string,
}

const Iconify = forwardRef(({ icon, width = 20, sx, ...other } : Props , ref) => (
  <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
));


export default Iconify;
