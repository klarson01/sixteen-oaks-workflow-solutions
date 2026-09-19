# GEO content and entity proposal

Status: approved by Kevin on September 19, 2026, with Northern Illinois added to the service area.

## Goal

Help search and generative-answer systems understand what Sixteen Oaks does, who it serves, where it works, and how a customer can begin—without changing the approved Main Street design or making unsupported claims.

## Proposed placement

Add one compact `Common questions` section near the end of the Services page, immediately before the existing contact section. Reuse the existing cream/light-section typography, spacing, and restrained reveal behavior. Do not add a new primary navigation item.

## Proposed public copy

### Common questions

#### What does Sixteen Oaks Workflow Solutions do?

Sixteen Oaks helps small and growing businesses improve the way they work through custom websites, practical AI and automation, and connected workflows or focused applications.

#### What kinds of businesses do you work with?

We work with owner-led and growing businesses that want a clearer online presence, less repetitive work, or a better way to move information from one task to the next.

#### Where does Sixteen Oaks work?

Sixteen Oaks is based in Monroe, Wisconsin, and primarily works with small businesses across southern Wisconsin and Northern Illinois. We can meet at your business or talk by phone.

#### Do I need to know which technology I need?

No. We begin with a conversation about your business and the part of the day you would like to make easier. Then we define a useful first step before recommending or building anything.

#### How can a small business use AI responsibly?

AI can help prepare drafts, summarize information, organize notes, and support follow-up. We build in clear review steps so your team stays responsible for what is approved and sent.

#### Can Sixteen Oaks continue helping after a website or workflow launches?

Yes. We can discuss ongoing care, updates, training, and practical next steps based on what your business needs.

## Structured data included in the review branch

- Explicit Organization founder, Wisconsin service area, contact point, and areas of expertise.
- A three-service OfferCatalog matching the current Services page.
- Service entities linked to the existing service sections.
- An ItemList for published project case studies.
- A CreativeWork entity for each published project detail page.
- Explicit OAI-SearchBot access while preserving the existing GPTBot policy.

After the visible questions are approved, add matching FAQPage structured data. The structured answers must remain identical in meaning to the text visitors can read.

## Deferred until verified or available

- `sameAs` links for Google Business Profile, Facebook, or LinkedIn.
- Reviews, testimonials, performance numbers, or customer outcomes not already verified.
- A street address or office-visit invitation; Sixteen Oaks is a service-area business and meets customers at their location or by phone.
- `llms.txt`; it is not required for Google AI features and is not a higher priority than indexed, accurate, answer-ready content.
