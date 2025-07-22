import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Switch,
    Alert,
    ActivityIndicator,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import textileDataJSON from '../textile_form_data.json'; // Adjust path as needed
import axios from 'axios';

// Type Definitions
type Language = 'English' | 'Hindi' | 'Marathi';

interface FormOption {
    category: string;
    subCategory: string;
    keyTask: string;
}

interface FormData {
    category: string;
    subCategory: string;
    keyTask: string;
}

type TextileData = Record<Language, FormOption[]>;

const textileData = textileDataJSON as TextileData;

const languages: Language[] = ['English', 'Hindi', 'Marathi'];

export default function TextileForm() {
    const colorScheme = useColorScheme();

    const lightTheme = {
        background: '#fff',
        card: '#f4f4f4',
        text: '#181a1b',
        label: '#232627',
        pickerBg: '#e5e5e5',
        pickerText: '#181a1b',
        border: '#ccc',
        button: '#0c77f2',
        buttonText: '#fff',
        activity: '#0c77f2',
    };
    const darkTheme = {
        background: '#181a1b',
        card: '#232627',
        text: '#f4f4f4',
        label: '#f4f4f4',
        pickerBg: '#19232a',
        pickerText: '#e5e5e5',
        border: '#232627',
        button: '#0c77f2',
        buttonText: '#fff',
        activity: '#0c77f2',
    };
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    const [language, setLanguage] = useState<Language>('English');
    const [useAltOptions, setUseAltOptions] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        subCategory: '',
        keyTask: '',
    });
    const [options, setOptions] = useState<FormOption[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        setOptions(textileData[language]);
        setFormData({ category: '', subCategory: '', keyTask: '' });
    }, [language, useAltOptions]);

    const isValid = (): boolean =>
        Object.values(formData).every((value) => value.trim() !== '');

    const handleChange = (field: keyof FormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (): Promise<void> => {
        if (!isValid()) {
            Alert.alert('Incomplete', 'Please fill all fields.');
            return;
        }

        setIsSubmitting(true);
        setCanSubmit(false);

        try {
            const res = await axios.post('https://your-api.com/submit', formData); // Replace with your endpoint
            Alert.alert('Success', 'Data submitted successfully!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Submission failed.');
        } finally {
            setTimeout(() => setCanSubmit(true), 5000);
            setIsSubmitting(false);
        }
    };

    const filteredCategories = Array.from(new Set(options.map((o) => o.category)));
    const filteredSubCategories = Array.from(new Set(options.map((o) => o.subCategory)));
    const filteredKeyTasks = Array.from(new Set(options.map((o) => o.keyTask)));

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]} style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: theme.text }]}>Textile to Fabric Form</Text>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.label }]}>Select Language</Text>
                <View style={[styles.pickerWrapper, { backgroundColor: theme.pickerBg, borderColor: theme.border }]}>
                    <Picker selectedValue={language} onValueChange={(val) => setLanguage(val as Language)} style={[styles.picker, { color: theme.pickerText }]}>
                        {languages.map((lang) => (
                            <Picker.Item label={lang} value={lang} key={lang} />
                        ))}
                    </Picker>
                </View>



                <Text style={[styles.label, { color: theme.label }]}>Category</Text>
                <View style={[styles.pickerWrapper, { backgroundColor: theme.pickerBg, borderColor: theme.border }]}>
                    <Picker
                        selectedValue={formData.category}
                        onValueChange={(val) => handleChange('category', val)}
                        style={[styles.picker, { color: theme.pickerText }]}
                    >
                        <Picker.Item label="Select Category" value="" />
                        {filteredCategories.map((val, i) => (
                            <Picker.Item label={val} value={val} key={`cat-${i}`} />
                        ))}
                    </Picker>
                </View>

                <Text style={[styles.label, { color: theme.label }]}>Sub-Category</Text>
                <View style={[styles.pickerWrapper, { backgroundColor: theme.pickerBg, borderColor: theme.border }]}>
                    <Picker
                        selectedValue={formData.subCategory}
                        onValueChange={(val) => handleChange('subCategory', val)}
                        style={[styles.picker, { color: theme.pickerText }]}
                    >
                        <Picker.Item label="Select Sub-Category" value="" />
                        {filteredSubCategories.map((val, i) => (
                            <Picker.Item label={val} value={val} key={`sub-${i}`} />
                        ))}
                    </Picker>
                </View>

                <Text style={[styles.label, { color: theme.label }]}>Key Task</Text>
                <View style={[styles.pickerWrapper, { backgroundColor: theme.pickerBg, borderColor: theme.border }]}>
                    <Picker
                        selectedValue={formData.keyTask}
                        onValueChange={(val) => handleChange('keyTask', val)}
                        style={[styles.picker, { color: theme.pickerText }]}
                    >
                        <Picker.Item label="Select Key Task" value="" />
                        {filteredKeyTasks.map((val, i) => (
                            <Picker.Item label={val} value={val} key={`task-${i}`} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button title="Reset" onPress={() => setFormData({ category: '', subCategory: '', keyTask: '' })} color={theme.button} disabled={isSubmitting} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        {isSubmitting ? (
                            <ActivityIndicator size="large" color={theme.activity} />
                        ) : (
                            <Button
                                title="Apply"
                                onPress={handleSubmit}
                                disabled={!isValid() || !canSubmit}
                                color={theme.button}
                            />
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%',
        flex: 1,
    },
    card: {
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginVertical: 20,
        width: '100%',
        alignSelf: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    label: {
        fontSize: 16,
        marginTop: 16,
        marginBottom: 4,
        fontWeight: '500',
    },
    pickerWrapper: {
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 60,
        fontSize: 15,
        paddingVertical: 10,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 10,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 2,
    },
});

