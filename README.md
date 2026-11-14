# Make the best-looking food picture — make.fun entry

A steaming bowl of ramen, photographed close: glossy noodles lifted by
chopsticks, a halved soft-boiled egg with a jammy yolk, glistening chashu,
nori and green onions in golden broth, warm light on a dark wooden table.

## Files

- `main.ts` — Node 22, standard library only. Copies `entry.png` to
  `/output/entry.png` and verifies it is a JPEG/PNG within the limits
  (at most 1 MiB, at most 1024x1024).
- `entry.png` — the picture (JPEG bytes, 1024x1024, 254,217 bytes).

## Run locally

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Competition

make.fun bounty `food-picture-01` — "Make the best-looking food picture".
