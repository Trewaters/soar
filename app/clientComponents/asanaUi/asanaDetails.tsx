import { Box, Stack, Typography } from "@mui/material"
import React, { ComponentProps } from "react"
import Image from "next/image"

interface asanaDetailsProps {
  details: string
  label: string
}

type AsanaDetailsProps = ComponentProps<typeof Stack> &
  // ComponentProps<typeof Typography> &
  // ComponentProps<typeof Image> &
  asanaDetailsProps

export default function AsanaDetails(props: AsanaDetailsProps) {
  return (
    <Box
      sx={{
        width: {
          xs: "100vw",
          md: "50vw",
        },
        px: { xs: "8px" },
      }}
      alignSelf={"center"}
    >
      <Stack direction={"row"} display={"flex"} alignItems={"center"}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mr: 2,
          }}
        >
          {props.label}:
        </Typography>
        <Image
          src={"/icons/designImages/leaf-1.svg"}
          alt="leaf-icon"
          width={21}
          height={21}
        ></Image>
      </Stack>
      <Stack>
        <Typography
          variant="body1"
          sx={{
            color: "primary.contrastText",
            borderTopRightRadius: { xs: 0, sm: 75 },
            borderBottomRightRadius: { xs: 0, sm: 75 },
            whiteSpace: "pre-line",
            ...props.sx,
          }}
        >
          {props?.details}
        </Typography>
      </Stack>
    </Box>
  )
}
