import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeamMemberCard } from "./TeamMemberCard";

describe("TeamMemberCard", () => {
  it("presents a team member's role, contributions and GitHub profile", () => {
    render(
      <TeamMemberCard
        contributions={["Designed the frontend architecture", "Designed the backend architecture"]}
        github="https://github.com/example"
        githubHandle="example"
        image="/photos/member.jpg"
        isLead
        name="Example Member"
        role="Team Lead & Full-Stack Developer"
      />
    );

    expect(screen.getByRole("article")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Example Member" })).toBeVisible();
    expect(screen.getByText("Team Lead & Full-Stack Developer")).toHaveClass("team-member-card__role--lead");
    expect(screen.getByRole("img", { name: "Example Member" })).toHaveAttribute("loading", "lazy");

    const contributions = screen.getByRole("list", { name: "Example Member's contributions" });
    expect(within(contributions).getAllByRole("listitem")).toHaveLength(2);

    expect(screen.getByRole("link", { name: "View Example Member's GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/example"
    );
    expect(screen.getByRole("link", { name: "View Example Member's GitHub profile" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });
});
