```tsx
<div
  className={classNames(
    "transition-all",
    styles.saveSection,
    "sticky bottom-0 left-0 right-0 flex flex-col p-3 md:p-5",
    "overflow-hidden",
    // `${!needsSave ? " translate-y-[100px]" : "translate-y-[0px]"} duration-[1s]`
    `${
      !needsSave
        ? "animate-[test_1s_ease-in-out_forwards]"
        : " animate-[test2_1s_ease-in-out_forwards]"
    } duration-[1s]`
  )}
>
  {/* <div className={`transition-all ${!needsSave ? " translate-y-[100px]" : "translate-y-[0px]"}`}> */}
  <Button mode="primary" disabled={loading} onClick={() => onClickSave()}>
    Save changes
  </Button>
  {/* </div> */}
</div>
```

```ts title="Tailwind animation example"
keyframes: {
        test: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100px)", padding: "0 0 0 0", height: "0", margin: "0 0 0 0" },
        },
        test2: {
          "0%": { transform: "translateY(100px)", padding: "0 0 0 0", height: "0", margin: "0 0 0 0" },
          "100%": { transform: "translateY(0) " },
        },
      },
```
