function CoachSettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Coach Settings</Text>}>
        <TextInput
          label="Target Cadence"
          settingsKey="targetCadence"
          placeholder="180"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(CoachSettings);
