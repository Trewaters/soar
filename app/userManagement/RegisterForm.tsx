// components/RegisterForm.tsx

import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Box } from '@mui/material'
import axios from 'axios'

const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
})

// const RegisterForm = () => {
//   return (
//     <Formik
//       initialValues={{ email: '', password: '' }}
//       validationSchema={RegistrationSchema}
//       onSubmit={async (values, { setSubmitting }) => {
//         try {
//           // const response = await axios.post('/api/register', values)
//           alert('Registration successful')
//         } catch (error) {
//           alert('Registration failed')
//         }
//         setSubmitting(false)
//       }}
//     >
//       {({ isSubmitting, errors, touched }) => (
//         <Form>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <Field
//               as={TextField}
//               name="email"
//               type="email"
//               label="Email"
//               helperText={touched.email && errors.email}
//               error={touched.email && Boolean(errors.email)}
//               variant="outlined"
//               fullWidth
//             />
//             <Field
//               as={TextField}
//               name="password"
//               type="password"
//               label="Password"
//               helperText={touched.password && errors.password}
//               error={touched.password && Boolean(errors.password)}
//               variant="outlined"
//               fullWidth
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={isSubmitting}
//               fullWidth
//             >
//               Register
//             </Button>
//           </Box>
//         </Form>
//       )}
//     </Formik>
//   )
// }

// export default RegisterForm
