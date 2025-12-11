import { UserProfile, ProjectConfig, GeneratorMode, GeneratedContent, ArchitectState } from '../types';
import { generateContent as generateWithGemini } from './geminiService';
import { generateContentWithClaude, ClaudeModel } from './claudeService';
import { generateContentWithDeepSeek, DeepSeekModel } from './deepseekService';
import { generateContentWithQwen, QwenModel } from './qwenService';
import { generateContentWithMistral, MistralModel } from './mistralService';

export type AIModel =
    | 'gemini-2.5-flash'
    | 'claude-3-5-sonnet-20241022'
    | 'claude-3-opus-20240229'
    | 'deepseek-coder'
    | 'qwen-2.5-coder-32b'
    | 'mistral-codestral';

export interface AIServiceConfig {
    model: AIModel;
}

/**
 * Unified AI service that routes requests to the appropriate AI provider
 * based on the selected model.
 */
export const generateContent = async (
    mode: GeneratorMode,
    profile: UserProfile,
    config: AIServiceConfig,
    project?: ProjectConfig,
    architectState?: ArchitectState
): Promise<GeneratedContent> => {
    const { model } = config;

    // Route to appropriate service based on model
    if (model === 'gemini-2.5-flash') {
        return generateWithGemini(mode, profile, project, architectState);
    } else if (model === 'claude-3-5-sonnet-20241022' || model === 'claude-3-opus-20240229') {
        return generateContentWithClaude(mode, profile, model as ClaudeModel, project, architectState);
    } else if (model === 'deepseek-coder') {
        return generateContentWithDeepSeek(mode, profile, 'deepseek-coder', project, architectState);
    } else if (model === 'qwen-2.5-coder-32b') {
        return generateContentWithQwen(mode, profile, 'qwen/qwen-2.5-coder-32b-instruct', project, architectState);
    } else if (model === 'mistral-codestral') {
        return generateContentWithMistral(mode, profile, 'codestral-latest', project, architectState);
    } else {
        return {
            markdown: `### Error\n\nUnsupported AI model: ${model}`,
        };
    }
};

/**
 * Get a human-readable name for an AI model
 */
export const getModelDisplayName = (model: AIModel): string => {
    switch (model) {
        case 'gemini-2.5-flash':
            return 'Google Gemini 2.5 Flash';
        case 'claude-3-5-sonnet-20241022':
            return 'Claude 3.5 Sonnet';
        case 'claude-3-opus-20240229':
            return 'Claude 3 Opus';
        case 'deepseek-coder':
            return 'DeepSeek Coder';
        case 'qwen-2.5-coder-32b':
            return 'Qwen 2.5 Coder 32B';
        case 'mistral-codestral':
            return 'Mistral Codestral';
        default:
            return model;
    }
};

/**
 * Get a description for an AI model
 */
export const getModelDescription = (model: AIModel): string => {
    switch (model) {
        case 'gemini-2.5-flash':
            return 'Fast and free - Best for quick responses and general tasks';
        case 'claude-3-5-sonnet-20241022':
            return 'Balanced performance - Great for most development tasks';
        case 'claude-3-opus-20240229':
            return 'Highest quality - Best for complex reasoning and critical tasks';
        case 'deepseek-coder':
            return 'Code specialist - Excellent for coding tasks, very affordable';
        case 'qwen-2.5-coder-32b':
            return 'Open-source coder - Free via OpenRouter, great for code generation';
        case 'mistral-codestral':
            return 'Fast code generation - Mid-tier pricing, good balance';
        default:
            return '';
    }
};

/**
 * Get all available AI models
 */
export const getAvailableModels = (): AIModel[] => {
    return [
        'gemini-2.5-flash',
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'deepseek-coder',
        'qwen-2.5-coder-32b',
        'mistral-codestral',
    ];
};
