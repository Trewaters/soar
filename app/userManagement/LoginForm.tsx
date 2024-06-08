// components/LoginForm.tsx

import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Box } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
})

const LoginForm = () => {
  const router = useRouter()

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post('/api/login', values)
          localStorage.setItem('token', response.data.token)
          router.push('/dashboard')
        } catch (error) {
          alert('Login failed')
        }
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              as={TextField}
              name="email"
              type="email"
              label="Email"
              helperText={touched.email && errors.email}
              error={touched.email && Boolean(errors.email)}
              variant="outlined"
              fullWidth
            />
            <Field
              as={TextField}
              name="password"
              type="password"
              label="Password"
              helperText={touched.password && errors.password}
              error={touched.password && Boolean(errors.password)}
              variant="outlined"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
            >
              Login
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
