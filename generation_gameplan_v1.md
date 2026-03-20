## Reference Naming Proposal

The current filenames are usable, but they mix wardrobe, color, and crop language inconsistently. Recommended format:

`summer_[set]_[nn]_[primary-look]_[framing-or-pose].png`

Examples:

- `summer_likeness_01_black_closeup_front.png`
- `summer_likeness_02_black_midshot_waves.png`
- `summer_body_01_rooftop_side_profile.png`
- `summer_style_01_bw_hollywood_glam.png`

Suggested cleanup for the strongest recurring files:

- `summer_final_likeness/black_closeup.png` → `summer_likeness_01_black_closeup_front.png`
- `summer_final_likeness/black_top_midshot.png` → `summer_likeness_02_black_midshot_waves.png`
- `summer_final_likeness/peach_closeup_mid_shot.png` → `summer_likeness_03_peach_midshot_front.png`
- `summer_final_likeness/purple_closeup_1.png` → `summer_likeness_04_purple_closeup_ponytail.png`
- `summer_final_likeness/purple_closeup_4.png` → `summer_likeness_05_purple_closeup_profile_hold.png`
- `summer_final_likeness/yellow_on_black_midshot.png` → `summer_likeness_06_yellow_midshot_editorial.png`
- `summer_final_body/rooftop_side_peach.png` → `summer_body_01_rooftop_side_profile.png`
- `summer_final_body/grass_stretch_standing.png` → `summer_body_02_grass_stretch_fullbody.png`
- `summer_final_body/squat_band.png` → `summer_body_03_studio_squat_profile.png`
- `summer_final_body/red_top_sitting.png` → `summer_body_04_redtop_seated_portrait.png`
- `summer_final_style/black_and_white_pose.png` → `summer_style_01_bw_hollywood_glam.png`
- `summer_final_style/black_cutout_top.png` → `summer_style_02_black_cutout_editorial.png`
- `summer_final_style/jeans_sitting.png` → `summer_style_03_jeans_seated_lifestyle.png`
- `summer_final_style/peach_rooftop.png` → `summer_style_04_peach_rooftop_athletic.png`

## Best 6 Likeness References

- `summer_final_likeness/black_closeup.png` — strongest face anchor for jawline, lips, eye color, and premium close portrait realism
- `summer_final_likeness/black_top_midshot.png` — best bridge between face identity and polished editorial body presentation
- `summer_final_likeness/peach_closeup_mid_shot.png` — excellent front-facing likeness with warm palette and subtle tattoo visibility
- `summer_final_likeness/purple_closeup_1.png` — best athletic ponytail face reference with sharp eye and lip fidelity
- `summer_final_likeness/purple_closeup_4.png` — strong secondary face anchor for profile nuance and elegant neck/shoulder framing
- `summer_final_likeness/yellow_on_black_midshot.png` — good alternate mid-shot anchor for expression and website-friendly portrait variation

## Best 4 Body References

- `summer_final_body/rooftop_side_peach.png` — best premium athletic side-profile body reference for rooftop/editorial prompts
- `summer_final_body/grass_stretch_standing.png` — best full-body athletic proportion reference with natural leg and torso length
- `summer_final_body/squat_band.png` — best lower-body and athletic-stance reference without exaggerated bulk
- `summer_final_body/red_top_sitting.png` — best softer portrait-body bridge for seated and lifestyle prompts

## Best 4 Style References

- `summer_final_style/black_and_white_pose.png` — strongest black-and-white Hollywood glam direction
- `summer_final_style/black_cutout_top.png` — strongest modern luxury editorial wardrobe direction
- `summer_final_style/jeans_sitting.png` — best cinematic lifestyle and approachable premium styling reference
- `summer_final_style/peach_rooftop.png` — best rooftop editorial-athletic style bridge

## Recommended First-Generation Order

1. `warm_neutral_editorial_headshot`
2. `bw_hollywood_glam_close_portrait`
3. `luxury_fitness_studio_portrait`
4. `premium_rooftop_athletic_portrait`
5. `cinematic_lifestyle_portrait`
6. `monochrome_selective_color_hero`

Reasoning:

- Start with the warm neutral headshot to lock facial identity with the lowest drift risk.
- Follow with black-and-white glam once the face is already visually anchored.
- Move into studio and rooftop images only after the identity is holding.
- Save selective-color hero work for last because stylization can increase drift.

## What to Approve Before Moving to 4K Exports

Approve these first at native or provider-high-res output:

- one warm neutral editorial headshot with excellent facial accuracy
- one black-and-white glam portrait with zero face drift
- one luxury fitness studio wide image with strong text-safe composition
- one rooftop athletic image with accurate proportions
- one signature hero image, either monochrome selective color or the cleanest wide studio portrait

Only then create final exports for:

- `desktop_hero` at `3840x2160`
- `mobile_hero` at `2160x3840`
- `editorial_portrait` at `2400x3000`

## Google AI Studio Attachment Strategy

For the first generation round, keep the attachment stack disciplined:

- Use 2 to 3 face anchors from the likeness folder on every prompt.
- Add 1 body image only when composition or pose matters.
- Add 1 style image only when you need the aesthetic pushed in a specific direction.
- Avoid attaching too many images at once because the face can average out and drift.

Default anchor trio for the first round:

- `summer_final_likeness/black_closeup.png`
- `summer_final_likeness/black_top_midshot.png`
- `summer_final_likeness/purple_closeup_4.png`

Swap in `summer_final_likeness/peach_closeup_mid_shot.png` when you want warmer editorial softness, and `summer_final_likeness/purple_closeup_1.png` when you want athletic ponytail energy.
