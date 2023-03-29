import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import { StyledLabel } from './styles';

// ----------------------------------------------------------------------

type Props = {
  sx?: object;
  endIcon?: any;
  children?: any;
  startIcon?: any;
  variant?: 'filled' | 'outlined' | 'ghost' | 'soft';
  color?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
}

const Label = forwardRef(({ children, color = 'default', variant = 'soft', startIcon, endIcon, sx, ...other } : Props, ref) => {
  const theme = useTheme();

  const iconStyle = {
    width: 16,
    height: 16,
    '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
  };

  return (
    // @ts-nocheck
    <StyledLabel
      ref={ref}
      component="span"
      ownerState={{ color, variant }}
      sx={{
        ...(startIcon && { pl: 0.75 }),
        ...(endIcon && { pr: 0.75 }),
        ...sx,
      }}
      theme={theme}
      {...other}
    >
      {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

      {children}

      {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
    </StyledLabel>
  );
});

Label.propTypes = {
  sx: PropTypes.object,
  endIcon: PropTypes.node,
  children: PropTypes.node,
  startIcon: PropTypes.node,
  variant: PropTypes.oneOf(['filled', 'outlined', 'ghost', 'soft']),
};

export default Label;
