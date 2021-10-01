import { fireEvent, render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/client"

import { SubscribeButton } from "."

jest.mock("next-auth/client")
jest.mock("next/router")

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    )
  
    expect(screen.getByText("Subscribe now")).toBeInTheDocument()
  })

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    )
    const subscribeButton = screen.getByText("Subscribe now")
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it("redirects to posts when user already has a subscription", () => {
    const pushMock = jest.fn()

    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "Jhon Doe",
          email: "jhon.doe@example.com"
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires"
      },
      false
    ])

    render(
      <SubscribeButton />
    )
    const subscribeButton = screen.getByText("Subscribe now")
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith("/posts")
  })
})